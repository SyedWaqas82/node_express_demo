//db = db.getSiblingDB('maindb');

db.createCollection('test_collection');

// use mydatabase

db.createUser({
  user: 'waqas',
  pwd: 'waqas',
  roles: [
    {
      role: 'readWrite',
      db: 'maindb',
    },
  ],
});
