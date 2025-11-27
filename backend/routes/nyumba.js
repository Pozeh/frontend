const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// Middleware to check authentication (reuse existing auth middleware)
const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    req.user = req.session.user;
    next();
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// Middleware to check agent role
const requireAgent = (req, res, next) => {
    if (!req.user || req.user.role !== 'seller') {
        return res.status(403).json({ success: false, message: 'Agent access required' });
    }
    next();
};

// GET /api/nyumba/listings - Paginated listings with search and filters
router.get('/listings', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const {
            location = '',
            min = '',
            max = '',
            type = '',
            page = 1,
            limit = 12,
            status = 'approved'
        } = req.query;

        // Build query
        const query = { status };
        
        if (location) {
            query.$or = [
                { 'location.city': { $regex: location, $options: 'i' } },
                { 'location.area': { $regex: location, $options: 'i' } }
            ];
        }
        
        if (min || max) {
            query.price = {};
            if (min) query.price.$gte = parseInt(min);
            if (max) query.price.$lte = parseInt(max);
        }
        
        if (type) {
            query.propertyType = type;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [listings, total] = await Promise.all([
            db.collection('nyumba_listings')
                .find(query)
                .sort({ createdAt: -1, featured: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .toArray(),
            db.collection('nyumba_listings').countDocuments(query)
        ]);

        // Populate agent information
        const listingsWithAgents = await Promise.all(
            listings.map(async (listing) => {
                if (listing.agentId) {
                    const agent = await db.collection('nyumba_agents')
                        .findOne({ _id: listing.agentId });
                    return { ...listing, agent };
                }
                return listing;
            })
        );

        res.json({
            success: true,
            listings: listingsWithAgents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch listings' });
    }
});

// GET /api/nyumba/listings/:id - Get listing details
router.get('/listings/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid listing ID' });
        }

        const listing = await db.collection('nyumba_listings').findOne({ _id: new ObjectId(id) });
        
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Populate agent information
        if (listing.agentId) {
            const agent = await db.collection('nyumba_agents')
                .findOne({ _id: listing.agentId });
            listing.agent = agent;
        }

        res.json({ success: true, listing });
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch listing' });
    }
});

// POST /api/nyumba/listings - Create listing (agent only)
router.post('/listings', authenticateUser, requireAgent, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const listingData = {
            ...req.body,
            agentId: new ObjectId(req.user.userId),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validate required fields
        const required = ['title', 'description', 'price', 'location'];
        const missing = required.filter(field => !listingData[field]);
        if (missing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing required fields: ${missing.join(', ')}` 
            });
        }

        const result = await db.collection('nyumba_listings').insertOne(listingData);
        
        // Log activity
        await db.collection('activity_log').insertOne({
            type: 'listing_created',
            userId: req.user.userId,
            listingId: result.insertedId,
            timestamp: new Date(),
            details: `New listing created: ${listingData.title}`
        });

        res.json({
            success: true,
            listingId: result.insertedId,
            message: 'Listing submitted for approval'
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ success: false, message: 'Failed to create listing' });
    }
});

// PUT /api/nyumba/listings/:id - Update listing (agent only)
router.put('/listings/:id', authenticateUser, requireAgent, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid listing ID' });
        }

        const existingListing = await db.collection('nyumba_listings')
            .findOne({ _id: new ObjectId(id) });
        
        if (!existingListing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (existingListing.agentId.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
        }

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        delete updateData.agentId; // Don't allow changing agent
        delete updateData.status; // Don't allow status changes via this endpoint

        const result = await db.collection('nyumba_listings')
            .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({ success: true, message: 'Listing updated successfully' });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ success: false, message: 'Failed to update listing' });
    }
});

// DELETE /api/nyumba/listings/:id - Delete listing (agent only)
router.delete('/listings/:id', authenticateUser, requireAgent, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid listing ID' });
        }

        const existingListing = await db.collection('nyumba_listings')
            .findOne({ _id: new ObjectId(id) });
        
        if (!existingListing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (existingListing.agentId.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
        }

        const result = await db.collection('nyumba_listings')
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Log activity
        await db.collection('activity_log').insertOne({
            type: 'listing_deleted',
            userId: req.user.userId,
            listingId: new ObjectId(id),
            timestamp: new Date(),
            details: `Listing deleted: ${existingListing.title}`
        });

        res.json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ success: false, message: 'Failed to delete listing' });
    }
});

// POST /api/nyumba/listings/:id/report - Report listing (public)
router.post('/listings/:id/report', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { reporterEmail, message } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid listing ID' });
        }

        const listing = await db.collection('nyumba_listings')
            .findOne({ _id: new ObjectId(id) });
        
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (!reporterEmail || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Reporter email and message are required' 
            });
        }

        const report = {
            listingId: new ObjectId(id),
            reporterEmail,
            message,
            createdAt: new Date(),
            resolved: false
        };

        await db.collection('nyumba_reports').insertOne(report);

        res.json({ success: true, message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error reporting listing:', error);
        res.status(500).json({ success: false, message: 'Failed to submit report' });
    }
});

// GET /api/nyumba/agents/pending - Get pending agents (admin only)
router.get('/agents/pending', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const agents = await db.collection('nyumba_agents')
            .find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .toArray();

        // Populate user information
        const agentsWithUsers = await Promise.all(
            agents.map(async (agent) => {
                const user = await db.collection('users')
                    .findOne({ _id: agent.userId });
                return { ...agent, user };
            })
        );

        res.json({ success: true, agents: agentsWithUsers });
    } catch (error) {
        console.error('Error fetching pending agents:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending agents' });
    }
});

// POST /api/nyumba/agents/:id/approve - Approve agent (admin only)
router.post('/agents/:id/approve', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid agent ID' });
        }

        const result = await db.collection('nyumba_agents')
            .updateOne(
                { _id: new ObjectId(id) },
                { 
                    $set: { 
                        status: 'approved',
                        updatedAt: new Date()
                    }
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        // Log activity
        await db.collection('activity_log').insertOne({
            type: 'agent_approved',
            adminId: req.user.userId,
            agentId: new ObjectId(id),
            timestamp: new Date(),
            details: `Agent approved by admin`
        });

        res.json({ success: true, message: 'Agent approved successfully' });
    } catch (error) {
        console.error('Error approving agent:', error);
        res.status(500).json({ success: false, message: 'Failed to approve agent' });
    }
});

// POST /api/nyumba/agents/:id/reject - Reject agent (admin only)
router.post('/agents/:id/reject', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { reason } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid agent ID' });
        }

        const result = await db.collection('nyumba_agents')
            .updateOne(
                { _id: new ObjectId(id) },
                { 
                    $set: { 
                        status: 'rejected',
                        rejectionReason: reason || 'Not specified',
                        updatedAt: new Date()
                    }
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        // Log activity
        await db.collection('activity_log').insertOne({
            type: 'agent_rejected',
            adminId: req.user.userId,
            agentId: new ObjectId(id),
            timestamp: new Date(),
            details: `Agent rejected by admin: ${reason || 'No reason provided'}`
        });

        res.json({ success: true, message: 'Agent rejected successfully' });
    } catch (error) {
        console.error('Error rejecting agent:', error);
        res.status(500).json({ success: false, message: 'Failed to reject agent' });
    }
});

// POST /api/nyumba/escrow/initiate - Simulated escrow initiation
router.post('/escrow/initiate', authenticateUser, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { listingId, amount, payerInfo } = req.body;

        if (!listingId || !amount || !payerInfo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Listing ID, amount, and payer information are required' 
            });
        }

        // Verify listing exists
        const listing = await db.collection('nyumba_listings')
            .findOne({ _id: new ObjectId(listingId), status: 'approved' });
        
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found or not approved' });
        }

        const escrow = {
            listingId: new ObjectId(listingId),
            amount: parseFloat(amount),
            payerInfo,
            payeeInfo: {
                agentId: listing.agentId,
                // In production, this would be the agent's payment details
            },
            status: 'initiated',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            transactionId: `ESC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const result = await db.collection('nyumba_escrows').insertOne(escrow);

        // Log activity
        await db.collection('activity_log').insertOne({
            type: 'escrow_initiated',
            userId: req.user.userId,
            listingId: new ObjectId(listingId),
            escrowId: result.insertedId,
            timestamp: new Date(),
            details: `Escrow initiated for KES ${amount}`
        });

        res.json({
            success: true,
            escrowId: result.insertedId,
            transactionId: escrow.transactionId,
            paymentUrl: `/nyumba/escrow/${result.insertedId}`, // Simulated payment URL
            message: 'Escrow initiated successfully. Complete payment within 24 hours.',
            expiresAt: escrow.expiresAt
        });
    } catch (error) {
        console.error('Error initiating escrow:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate escrow' });
    }
});

// GET /api/nyumba/stats - Get statistics for dashboard
router.get('/stats', authenticateUser, async (req, res) => {
    try {
        const db = req.app.locals.db;
        
        const [totalListings, activeListings, pendingListings, totalAgents, pendingAgents] = await Promise.all([
            db.collection('nyumba_listings').countDocuments({ status: 'approved' }),
            db.collection('nyumba_listings').countDocuments({ 
                status: 'approved',
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
            }),
            db.collection('nyumba_listings').countDocuments({ status: 'pending' }),
            db.collection('nyumba_agents').countDocuments({ status: 'approved' }),
            db.collection('nyumba_agents').countDocuments({ status: 'pending' })
        ]);

        let userListings = 0;
        let userEscrows = 0;

        if (req.user.role === 'seller') {
            // Agent-specific stats
            [userListings, userEscrows] = await Promise.all([
                db.collection('nyumba_listings').countDocuments({ 
                    agentId: new ObjectId(req.user.userId) 
                }),
                db.collection('nyumba_escrows').countDocuments({ 
                    payerInfo: { email: req.user.email } 
                })
            ]);
        }

        res.json({
            success: true,
            stats: {
                totalListings,
                activeListings,
                pendingListings,
                totalAgents,
                pendingAgents,
                userListings,
                userEscrows
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});

module.exports = router;
