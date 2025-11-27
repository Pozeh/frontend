const { MongoClient, ObjectId } = require('mongodb');

// Database migration helper for NyumbaSure collections
async function createNyumbaCollections() {
    const client = new MongoClient(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://ecoloop:paul965757@cluster0.osksekt.mongodb.net/?appName=Cluster0');
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('🏠 Creating NyumbaSure collections...');
        
        // Create collections with indexes
        const collections = [
            {
                name: 'nyumba_listings',
                indexes: [
                    { key: { status: 1, createdAt: -1 } },
                    { key: { agentId: 1 } },
                    { key: { 'location.city': 1, 'location.area': 1 } },
                    { key: { price: 1 } },
                    { key: { propertyType: 1 } },
                    { key: { featured: -1, createdAt: -1 } }
                ]
            },
            {
                name: 'nyumba_agents',
                indexes: [
                    { key: { userId: 1 } },
                    { key: { status: 1 } },
                    { key: { createdAt: -1 } }
                ]
            },
            {
                name: 'nyumba_reports',
                indexes: [
                    { key: { listingId: 1 } },
                    { key: { reporterEmail: 1 } },
                    { key: { createdAt: -1 } },
                    { key: { resolved: 1 } }
                ]
            },
            {
                name: 'nyumba_escrows',
                indexes: [
                    { key: { transactionId: 1 }, unique: true },
                    { key: { listingId: 1 } },
                    { key: { status: 1 } },
                    { key: { createdAt: -1 } },
                    { key: { expiresAt: 1 } }
                ]
            }
        ];
        
        for (const collection of collections) {
            try {
                // Create collection if it doesn't exist
                const existing = await db.listCollections({ name: collection.name }).toArray();
                if (existing.length === 0) {
                    await db.createCollection(collection.name);
                    console.log(`✅ Created collection: ${collection.name}`);
                } else {
                    console.log(`ℹ️  Collection already exists: ${collection.name}`);
                }
                
                // Create indexes
                for (const index of collection.indexes) {
                    try {
                        await db.collection(collection.name).createIndex(index.key, index.unique ? { unique: true } : {});
                        console.log(`  📋 Created index on: ${JSON.stringify(index.key)}`);
                    } catch (indexError) {
                        if (indexError.code === 85) {
                            console.log(`  ⚠️  Index already exists: ${JSON.stringify(index.key)}`);
                        } else {
                            console.error(`  ❌ Failed to create index:`, indexError);
                        }
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error with collection ${collection.name}:`, error);
            }
        }
        
        // Insert sample data if collections are empty
        await insertSampleData(db);
        
        console.log('🎉 NyumbaSure database setup completed!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
    } finally {
        await client.close();
    }
}

// Insert sample data for development
async function insertSampleData(db) {
    try {
        // Check if data already exists
        const listingsCount = await db.collection('nyumba_listings').countDocuments();
        const agentsCount = await db.collection('nyumba_agents').countDocuments();
        
        if (listingsCount > 0 || agentsCount > 0) {
            console.log('ℹ️  Sample data already exists, skipping insertion');
            return;
        }
        
        console.log('📝 Inserting sample data...');
        
        // Sample agents
        const sampleAgents = [
            {
                userId: new ObjectId('507f1f77bcf86cd799439011'), // Dummy user ID
                name: 'John Kamau Properties',
                phone: '+254712345678',
                email: 'john@kamau.properties',
                idVerified: true,
                status: 'approved',
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
            },
            {
                userId: new ObjectId('507f1f77bcf86cd799439012'),
                name: 'Nairobi Homes Ltd',
                phone: '+254723456789',
                email: 'info@nairobihomes.co.ke',
                idVerified: true,
                status: 'approved',
                createdAt: new Date('2024-02-20'),
                updatedAt: new Date('2024-02-20')
            }
        ];
        
        const insertedAgents = await db.collection('nyumba_agents').insertMany(sampleAgents);
        
        // Sample listings
        const sampleListings = [
            {
                title: 'Modern 2BR Apartment in Kilimani',
                description: 'Beautiful modern apartment with city views, fully furnished, 24/7 security, swimming pool, gym access. Perfect for professionals.',
                price: 45000,
                deposit: 90000,
                serviceCharge: 5000,
                estUtilities: 8000,
                propertyType: '2BR',
                furnished: true,
                location: {
                    city: 'Nairobi',
                    area: 'Kilimani',
                    coords: { lat: -1.2921, lng: 36.8219 },
                    address: 'Kilimani Road, near Yaya Centre'
                },
                images: [
                    '/assets/nyumba/listings/kilimani-2br-1.jpg',
                    '/assets/nyumba/listings/kilimani-2br-2.jpg',
                    '/assets/nyumba/listings/kilimani-2br-3.jpg'
                ],
                videoUrl: null,
                agentId: insertedAgents.insertedIds[0],
                status: 'approved',
                featured: true,
                verifiedPhotos: true,
                verifiedAgent: true,
                amenities: ['parking', 'gym', 'pool', 'security', 'balcony'],
                createdAt: new Date('2024-03-10'),
                updatedAt: new Date('2024-03-10')
            },
            {
                title: 'Cozy Bedsitter in Westlands',
                description: 'Affordable bedsitter with modern finishes, near Westlands Mall, good security, water backup, prepaid electricity.',
                price: 15000,
                deposit: 30000,
                serviceCharge: 2000,
                estUtilities: 3500,
                propertyType: 'Bedsitter',
                furnished: false,
                location: {
                    city: 'Nairobi',
                    area: 'Westlands',
                    coords: { lat: -1.2655, lng: 36.7984 },
                    address: 'General Mathenge Road, Westlands'
                },
                images: [
                    '/assets/nyumba/listings/westlands-bedsitter-1.jpg',
                    '/assets/nyumba/listings/westlands-bedsitter-2.jpg'
                ],
                videoUrl: null,
                agentId: insertedAgents.insertedIds[0],
                status: 'approved',
                featured: false,
                verifiedPhotos: true,
                verifiedAgent: true,
                amenities: ['parking', 'security', 'water_backup'],
                createdAt: new Date('2024-03-15'),
                updatedAt: new Date('2024-03-15')
            },
            {
                title: 'Spacious 3BR Family House in Lavington',
                description: 'Large 3-bedroom house with garden, servant quarters, 2-car parking, near Lavington Mall, excellent neighborhood.',
                price: 85000,
                deposit: 170000,
                serviceCharge: 8000,
                estUtilities: 12000,
                propertyType: '3BR',
                furnished: true,
                location: {
                    city: 'Nairobi',
                    area: 'Lavington',
                    coords: { lat: -1.2889, lng: 36.7658 },
                    address: 'Lavington Road, near Junction'
                },
                images: [
                    '/assets/nyumba/listings/lavington-3br-1.jpg',
                    '/assets/nyumba/listings/lavington-3br-2.jpg',
                    '/assets/nyumba/listings/lavington-3br-3.jpg',
                    '/assets/nyumba/listings/lavington-3br-4.jpg'
                ],
                videoUrl: null,
                agentId: insertedAgents.insertedIds[1],
                status: 'approved',
                featured: true,
                verifiedPhotos: true,
                verifiedAgent: true,
                amenities: ['parking', 'garden', 'security', 'servant_quarters', 'gym'],
                createdAt: new Date('2024-03-20'),
                updatedAt: new Date('2024-03-20')
            },
            {
                title: 'Affordable 1BR in Kileleshwa',
                description: 'Clean 1-bedroom apartment, near Kileleshwa Primary School, good security, water reliable, public transport accessible.',
                price: 25000,
                deposit: 50000,
                serviceCharge: 3000,
                estUtilities: 5000,
                propertyType: '1BR',
                furnished: false,
                location: {
                    city: 'Nairobi',
                    area: 'Kileleshwa',
                    coords: { lat: -1.2746, lng: 36.8099 },
                    address: 'Kileleshwa Road, near school'
                },
                images: [
                    '/assets/nyumba/listings/kileleshwa-1br-1.jpg',
                    '/assets/nyumba/listings/kileleshwa-1br-2.jpg'
                ],
                videoUrl: null,
                agentId: insertedAgents.insertedIds[1],
                status: 'approved',
                featured: false,
                verifiedPhotos: true,
                verifiedAgent: true,
                amenities: ['parking', 'security', 'water_backup'],
                createdAt: new Date('2024-03-25'),
                updatedAt: new Date('2024-03-25')
            }
        ];
        
        await db.collection('nyumba_listings').insertMany(sampleListings);
        
        console.log(`✅ Inserted ${sampleAgents.length} agents and ${sampleListings.length} listings`);
        
    } catch (error) {
        console.error('❌ Error inserting sample data:', error);
    }
}

// Rollback function to remove NyumbaSure collections
async function rollbackNyumbaCollections() {
    const client = new MongoClient(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://ecoloop:paul965757@cluster0.osksekt.mongodb.net/?appName=Cluster0');
    
    try {
        await client.connect();
        const db = client.db();
        
        console.log('🗑️  Rolling back NyumbaSure collections...');
        
        const collections = ['nyumba_listings', 'nyumba_agents', 'nyumba_reports', 'nyumba_escrows'];
        
        for (const collectionName of collections) {
            try {
                await db.collection(collectionName).drop();
                console.log(`✅ Dropped collection: ${collectionName}`);
            } catch (error) {
                if (error.code === 26) {
                    console.log(`ℹ️  Collection ${collectionName} does not exist`);
                } else {
                    console.error(`❌ Error dropping ${collectionName}:`, error);
                }
            }
        }
        
        console.log('🎉 NyumbaSure collections rollback completed!');
        
    } catch (error) {
        console.error('❌ Rollback failed:', error);
    } finally {
        await client.close();
    }
}

// Export functions for use in server setup
module.exports = {
    createNyumbaCollections,
    rollbackNyumbaCollections
};

// Run if called directly
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'create') {
        createNyumbaCollections();
    } else if (command === 'rollback') {
        rollbackNyumbaCollections();
    } else {
        console.log('Usage: node nyumba-migration.js [create|rollback]');
    }
}
