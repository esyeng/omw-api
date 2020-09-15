("use strict");
const pg = require("pg");
const Sequelize = require("sequelize");
const ddb = require("./ddb");
const axios = require("axios");
const {baseUrl} = "https://onmyway-api.herokuapp.com"
const { demoUser, demoEvent } = require("./models/demoModIndex");
// const faker = require("faker");
const users = [
  {
    id: 5,
    lastName: "Lemon",
    firstName: "Lulu",
    zip: "56494-3996",
    mobile: "1-838-380-0904 x840",
    longitude: 128.3922,
    latitude: 76.971199999999996,
    imageUrl: "https://s3.amazonaws.com/uifaces/faces/twitter/bboy1895/128.jpg",
    password: "test",
    isHost: true,
    email: "lulu@gmail.com",
    // eventId: 1
  },
  {
    id: 4,
    lastName: "Lazen",
    firstName: "Max",
    zip: "56494-3996",
    mobile: "1-838-380-0904 x840",
    longitude: 128.3922,
    latitude: 76.971199999999996,
    imageUrl: "https://s3.amazonaws.com/uifaces/faces/twitter/bboy1895/128.jpg",
    password: "test",
    isHost: true,
    email: "max@gmail.com",
    // eventId: 1
  },
  {
    id: 3,
    lastName: "Benson",
    firstName: "Bee",
    zip: "02799-0500",
    mobile: "1-776-897-7426 x323",
    longitude: 98.041499999999999,
    latitude: 84.040999999999997,
    imageUrl:
      "https://s3.amazonaws.com/uifaces/faces/twitter/bpartridge/128.jpg",
    password: "test",
    isHost: false,
    email: "bee@gmail.com",
    // eventId: 1
  },
  {
    id: 2,
    lastName: "Anderson",
    firstName: "Zach",
    zip: "41302",
    mobile: "1-254-667-4335 x084",
    longitude: -29.0137,
    latitude: -59.294199999999996,
    imageUrl: "https://s3.amazonaws.com/uifaces/faces/twitter/macxim/128.jpg",
    password: "test",
    isHost: true,
    email: "zach@gmail.com",
    // eventId: 2
  },
  {
    id: 1,
    lastName: "Nguyen",
    firstName: "Kani",
    zip: "68530",
    mobile: "1-779-620-3098",
    longitude: -85.741500000000002,
    latitude: 12.704499999999999,
    imageUrl:
      "https://s3.amazonaws.com/uifaces/faces/twitter/lonesomelemon/128.jpg",
    password: "test",
    isHost: false,
    email: "kani@gmail.com",
    // eventId: 2
  },
];

const events = [
  // {
  //   id: 1,
  //   latitude: 40.705286,
  //   longitude: -74.009233,
  //   date: "2020-09-17",
  //   time: "08:00:00",
  //   title: "Kani's Dance Class",
  //   description: "Kani's modern dance on highway 280",
  //   status: "Inactive",
  //   hostId: 1,
  // },
  {
    id: 2,
    latitude: 40.703286,
    longitude: -73.009233,
    date: "2020-09-17",
    time: "08:00:00",
    title: "Max's Party",
    description: "Come celebrate!",
    status: "Inactive",
    hostId: 4,
  },

];



const seed = async () => {
  try {
    await ddb.sync({ force: true });
    console.log("demo db synced");

    const friends = await Promise.all(
      users.map(async user => {
        const newUser = await demoUser.create(user);
        const toAdd1 = await demoUser.findByPk(2)
        const toAdd2 = await demoUser.findByPk(3);

        const friend1 = await newUser.addContact(toAdd1);
        const friend2 = await newUser.addContact(toAdd2);
      })
    );

    const eventArr = await Promise.all(events.map(async (event) => {
      const newEvent = await demoEvent.create(event);

      if (event.title === "Max's Party") {
        const user1 = await demoUser.findByPk(2);
        const user2 = await demoUser.findByPk(3);
        const add1 = await newEvent.addGuest(user1);
        const add2 = await newEvent.addGuest(user2);
      }

    }))


    console.log(`seeded friends for launch day`);
    console.log(`seeded successfully`);
  } catch (err) {
    console.error(err);
  }
};

const runSeed = async () => {
  console.log("seeding...");
  try {
    await seed();

  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await ddb.close();
    console.log("db connection closed");
  }
};

runSeed();

module.exports = {
  seed,
  runSeed,
  // associate
};
