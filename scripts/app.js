let controller = {};

$(() => {
  let app = Sammy("#container", function() {
    this.use("Handlebars", "hbs");

    this.get("#/home", controller.getHome);

    this.get("#/login", controller.getLogin);
    this.post("#/login", controller.loginUser);

    this.get("#/register", controller.getRegister);
    this.post("#/register", controller.registerUser);

    this.get('#/logout',controller.logoutUser);

    this.get('#/create',controller.getCreate);
    this.post('#/create',controller.createOffer);

    this.get('#/my',controller.getUserOffers);
    this.get("#/details/:id",controller.getDetails);

    this.get('#/edit/:id',controller.getEdit);
    this.post('#/edit/:id',controller.editOffer);

    this.get('#/delete/:id',controller.deleteOffer);
  });

  app.run("#/home");
});
