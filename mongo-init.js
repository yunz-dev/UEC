db = db.getSiblingDB('app');

// Create a collection to ensure the database is created
db.createCollection('events');

// Optionally add some initial data
db.events.insertOne({
  title: "Test Event",
  start: new Date(),
  end: new Date(new Date().getTime() + 3600000),
  description: "This is a test event"
});

// Create an application user with appropriate permissions
db = db.getSiblingDB('admin');
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [{ role: 'readWrite', db: 'app' }]
});
