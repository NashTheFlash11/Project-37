//Create variables here

var dog, happyDog;
var database;
var foodS;
var foodStock;
var dogImage, happyDogImage
var bedroomImage, gardenImage, washroomImage;
var readState, changeState;

function preload()
{
	//load images here
  dogImage = loadImage("images/happy dog.png");
  happyDogImage = loadImage("images/Happy.png");
  bedroomImage = loadImage("images/Bed Room.png");
  gardenImage = loadImage("images/Garden.png");
  washroomImage = loadImage("images/Wash Room.png");
}

function setup() {
	database = firebase.database();

  createCanvas(800, 500);
  foodObject = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
      gameState = data.val();
  });

  dog = createSprite(700, 400, 150, 150);

  dog.addImage(dogImage);
  dog.scale = 0.25;

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFoods = createButton("Add Food");
  addFoods.position(800, 95);
  addFoods.mousePressed(addFood);
}


function draw() {  
  background(46, 139, 87);

  currentTime = hour();
  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObject.garden();
  }
  else if(currentTime === (lastFed+2)){
    update("Sleeping")
    foodObject.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodObject.washroom();
  }
  else{
    updateState("Hungry");
    foodObject.display();
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFoods.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFoods.show();
    dog.addImage(dogImage);
  }

  foodObject.display();
  
  drawSprites();
  //add styles here

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12 + "PM", 360, 30);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM", 350, 30);
  }
  else{
    text("Last Feed: " + lastFed + "AM", 350, 30);
  }
}

function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food : foodS,
  });
}

function updateState(state){
  database.ref('/').update({
    gameState : state
  });
}

function feedDog(){
  dog.addImage(happyDogImage);
  foodObject.updateFoodStock(foodObject.getFoodStock() - 1);
  database.ref('/').update({
    Food : foodObject.getFoodStock(),
    FeedTime : hour(),
  });
}

function writeStock(x){
  fill("white");
  textSize(10);
  text("Drago Milks Left: " + x, 150, 150);

  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }

  database.ref('/').update({
    Food: x,
  });
}