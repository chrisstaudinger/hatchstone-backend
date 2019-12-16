const User = require('../models/User');
const Profile = require('../models/Profile');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

const clearDb = async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('profiles');
    // await mongoose.connection.db.dropCollection('messages');
    // await mongoose.connection.db.dropCollection('conversations');
}


const seedDb = async () => {
    // ---create users---
    console.log('attempting to seed users...');
    // client users
    const user1 = await User.create({
        email: 'alice@mail.com', 
        password: 'password'
    });

    const user2 = await User.create({
        email: 'sarah@mail.com', 
        password: 'password'
    });

    const user3 = await User.create({
        email: 'george@mail.com', 
        password: 'password'
    });

    const user4 = await User.create({
        email: 'matthew@mail.com', 
        password: 'password'
    });

    const user5 = await User.create({
        email: 'david@mail.com', 
        password: 'password'
    });

    // admin users
    const user6 = await User.create({
        email: 'admin-emma@mail.com', 
        password: 'password',
        admin: true
    });

    const user7 = await User.create({
        email: 'admin-kyle@mail.com', 
        password: 'password',
        admin: true
    });

    console.log('users sucessfully seeded 👍');

    // ---create profiles---
    console.log('attempting to seed profiles...');
    // client profiles
    const profile1 = await Profile.create({
        firstName: 'alice',
        lastName: 'wilson',
        phone: '0476233988',
        address: '75 park road, park orchards, vic, 3114',
        appProgress: 0,
        approved: false,
        investorType: 'individual',
        dateStarted: Date.now(),
        profileImage: '',
        documents: []
    });

    profile1.userId = user1._id;
    await profile1.save()

    const profile2 = await Profile.create({
        firstName: 'Sarah',
        lastName: 'James',
        phone: '0456734244',
        address: '40 william street, mount waverley, vic, 3149',
        appProgress: 1,
        approved: false,
        investorType: 'individual',
        dateStarted: Date.now(),
        profileImage: '',
        documents: []
    });

    profile2.userId = user2._id;
    await profile2.save();

    const profile3 = await Profile.create({
        firstName: 'george',
        lastName: 'bray',
        phone: '0432009765',
        address: '35 wells road, Oakleigh, vic, 3166',
        appProgress: 0,
        approved: false,
        investorType: 'individual',
        dateStarted: Date.now(),
        profileImage: '',
        documents: []
    });

    profile3.userId = user3._id;
     await profile3.save();

    const profile4 = await Profile.create({
        firstName: 'matthew',
        lastName: 'smith',
        phone: '0476233652',
        address: 'pelham drive, vermont south, vic, 3133',
        appProgress: 0,
        approved: false,
        investorType: 'individual',
        dateStarted: Date.now(),
        profileImage: '',
        documents: []
    });

    profile4.userId = user4._id;
    await profile4.save();

    const profile5 = await Profile.create({
        firstName: 'david',
        lastName: 'johnson',
        phone: '0498362993',
        address: '10 murcdoch street, camberwell, vic, 3124',
        appProgress: 0,
        approved: false,
        investorType: 'individual',
        dateStarted: Date.now(),
        profileImage: '',
        documents: []
    });

    profile5.userId = user5._id;
     await profile5.save();

    // admin profiles
    const profile6 = await Profile.create({
        firstName: 'emma',
        lastName: 'miller',
        phone: '0498223665',
        profileImage: ''
    });

    profile6.userId = user6._id;
    await profile6.save()

    const profile7 = await Profile.create({
        firstName: 'cole',
        lastName: 'johnson',
        phone: '0409377455',
        profileImage: ''
    });

    profile7.userId = user7._id;
    await profile7.save()

    console.log('users sucessfully seeded 👍');

     // ---create conversations---
    const conversation1 = Conversation.create({
        participants: []
    });
    
    const conversation2 = new Conversation({
        participants: []
    });

    const conversation3 = new Conversation({
        participants: []
    });

    const conversation4 = new Conversation({
        participants: []
    });

    const conversation5 = new Conversation({
        participants: []
    });

}

   
module.exports = {
    seedDb,
    clearDb
};