controller.getHome = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem("username");
  if (userService.isAuth()) {
    let allOffers = await mainService.getAllCars();
    allOffers.forEach(
      o => (o.isAuthor = o._acl.creator === sessionStorage.getItem("id"))
    );
    ctx.allOffers = allOffers;

    ctx.thereAreOffers = allOffers.length;
  }

  ctx
    .loadPartials({
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs",
      car: "./views/car.hbs"
    })
    .then(function() {
      this.partial("./views/home.hbs");
    });
};
controller.getUserOffers = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem("username");

  let userOffers = await mainService.getAllCars();

  userOffers = userOffers.filter(
    o => o._acl.creator === sessionStorage.getItem("id")
  );
  userOffers.forEach(
    o => (o.isAuthor = o._acl.creator === sessionStorage.getItem("id"))
  );

  
  ctx.thereAreOffers = userOffers.length;

  ctx.userOffers = userOffers;

  ctx
    .loadPartials({
      header: "./views/common/header.hbs",
      footer: "./views/common/footer.hbs",
      car: "./views/car.hbs"
    })
    .then(function() {
      this.partial("./views/myCars.hbs");
    });
};
controller.getRegister = function(ctx) {
  ctx.loadPartials(getPartials()).then(function() {
    this.partial("./views/register.hbs");
  });
};
controller.registerUser = function(ctx) {
  let { username, password, repeatPass } = ctx.params;

  if (checkPass(password, repeatPass)) {
    userService
      .register(username, password)
      .then(function(res) {
        userService.saveSession(res);
        ctx.redirect("#/home");
        notify.showInfo("Registration successful!");
      })
      .catch(err => notify.showError("Invalid credentials!"));
  } else {
    notify.showError(`Password's don't match!`);
  }
};

controller.getLogin = function(ctx) {
  ctx.loadPartials(getPartials()).then(function() {
    this.partial("./views/login.hbs");
  });
};
controller.loginUser = function(ctx) {
  let { username, password } = ctx.params;
  userService
    .login(username, password)
    .then(function(res) {
      userService.saveSession(res);
      ctx.redirect("#/home");
      notify.showInfo("Login successful!");
    })
    .catch(err => notify.showError("Invalid credentials"));
};
controller.logoutUser = function(ctx) {
  userService.logout().then(function() {
    sessionStorage.clear();
    ctx.redirect("#/home");
    notify.showInfo("Logout successful!");
  });
};
controller.getCreate = function(ctx) {
  ctx.isAuth = userService.isAuth();
  ctx.username = sessionStorage.getItem("username");
  ctx.loadPartials(getPartials()).then(function() {
    this.partial("./views/create.hbs");
  });
};
controller.createOffer = function(ctx) {
  let {
    title,
    description,
    brand,
    model,
    year,
    imageUrl,
    fuelType,
    price
  } = ctx.params;
  let seller = sessionStorage.getItem("username");
  let car = {
    title,
    description,
    brand,
    model,
    year,
    imageUrl,
    fuelType,
    price,
    seller
  };

  mainService.postOffer(car).then(function(res) {
    ctx.redirect("#/home");
    notify.showInfo("Offer created successfully!");
  });
};
controller.getDetails = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  let offer = await mainService.getACar(ctx.params.id);

  ctx.title = offer.title;
  ctx.imageUrl = offer.imageUrl;
  ctx.brand = offer.brand;
  ctx.description = offer.description;
  ctx.fuelType = offer.fuelType;
  ctx.model = offer.model;
  ctx.year = offer.year;
  ctx.price = offer.price;

  ctx.loadPartials(getPartials()).then(function() {
    this.partial("./views/details.hbs");
  });
};
controller.getEdit = async function(ctx) {
  ctx.isAuth = userService.isAuth();
  let offer = await mainService.getACar(ctx.params.id);

  ctx.title = offer.title;
  ctx.imageUrl = offer.imageUrl;
  ctx.brand = offer.brand;
  ctx.description = offer.description;
  ctx.fuelType = offer.fuelType;
  ctx.model = offer.model;
  ctx.year = offer.year;
  ctx.price = offer.price;
  ctx._id = offer._id;

  ctx.loadPartials(getPartials()).then(function() {
    this.partial("./views/edit.hbs");
  });
};
controller.editOffer = function(ctx) {
  mainService.getACar(ctx.params.id).then(function(res) {
    res.title = ctx.params.title;
    res.description = ctx.params.description;
    res.brand = ctx.params.brand;
    res.model = ctx.params.model;
    res.year = ctx.params.year;
    res.imageUrl = ctx.params.imageUrl;
    res.fuelType = ctx.params.fuelType;
    res.price = ctx.params.price;
    mainService.updateOffer(ctx.params.id, res).then(function(res) {
      ctx.redirect("#/home");
      notify.showInfo("Updated successfully.");
    });
  });
};
controller.deleteOffer = function(ctx) {
  mainService.deleteCar(ctx.params.id).then(function(res) {
    ctx.redirect("#/home");
    notify.showInfo("Deleted successfully.");
  });
};
function getPartials() {
  return {
    header: "./views/common/header.hbs",
    footer: "./views/common/footer.hbs"
  };
}

function checkPass(password, repeatPass) {
  if (password === repeatPass) {
    return true;
  } else {
    return false;
  }
}
