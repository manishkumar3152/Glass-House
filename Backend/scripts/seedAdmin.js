const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/config');

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for seeding admin...');

    const existingAdmin = await User.findOne({ email: 'admin@glasshouse.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Administrator',
        email: 'admin@glasshouse.com',
        password: 'password123',
        role: 'super_admin',
        phone: '+91 98765 00001'
      });
      console.log('Admin user created: admin@glasshouse.com / password123');
    } else {
      console.log('Admin user already exists');
    }

    const existingEmp = await User.findOne({ email: 'sales@glasshouse.com' });
    if (!existingEmp) {
      await User.create({
        name: 'Sales Executive',
        email: 'sales@glasshouse.com',
        password: 'password123',
        role: 'employee',
        phone: '+91 98765 00002'
      });
      console.log('Sales executive created: sales@glasshouse.com / password123');
    }

    console.log('Admin seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
