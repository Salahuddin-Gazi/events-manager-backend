module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/events/me",
      handler: "event.me",
      // config: {
      //   auth: true,
      // },
    },
    //   { // Path defined with a regular expression
    //     method: 'GET',
    //     path: '/restaurants/:category([a-z]+)', // Only match when the URL parameter is composed of lowercase letters
    //     handler: 'restaurant.findByCategory',
    //   }
  ],
};
