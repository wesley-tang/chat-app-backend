// Express initializes app to be a function handler that you can supply to an HTTP server
let app = require('express')();
// initialize a new instance of socket.io by passing the http (the HTTP server) object
let http = require('http').Server(app);
let io = require('socket.io')(http);

// Tracking users
let users = new Map();
let onlineUsers = new Map();

// List of all the messages so far
let chatlog = [];

function sanitize(message) {
	// Removing all html tag brackets
	return message.replace(/</g, "&lt").replace(/>/g, "&gt");
}

function namesOf(map){
	let names = [];

	onlineUsers.forEach( function(value, key, map) { names.push(value.username) }  );
	return names;
}

function genNewUser(socket){
	let user = {
		"id": genID(),
		"username": genUsername(),
		"colour": "f2f2f2",
		"socketID": socket.id
	};

	users.set(user.id, user);

	console.log("Creating new user! id:" + user.id );

	onlineUsers.set(user.id, user);

	socket.emit('user authed', {
		"user": user,
		"chatlog": chatlog,
		"onlineUsers": namesOf(onlineUsers)
	});

	console.log("Letting otehrs know userlist is changed");

	// Update all users 
	io.emit('userlist update', namesOf(onlineUsers));
}

// Generates a 5 digit long string of digits that is unique
function genID(){
	let id;

	do {
		id = "";
		// Generate a 5 character long random string of digits
		for (let i = 0; i < 5; i++)
			id += Math.floor((Math.random() * 10));
	} while (users.has(id));

	return id;
}

// Generate a random (uniqueness not guarenteed) username
function genUsername(){
	let word1 = ["Strange","Terrible","Popular","Fabulous","Shiny","Skillful","Average","Arrogant","Lazy","Biting","Wasteful","Gorgeous","Vicious","Loving","Cheery","Orange","Stoic","Vast","Course","Splendid","Hushed","Soulful","Soft","Black","Great","Furry","Slight","Crushing","Scary","Lithe","Hard","Content","Faint","Pretend","Poor","Famous","Fervent","Small","Creative","Vivid","Hope","Helpful","Bloody","Joyous","Fragile","Quickest","Slippery","Passive","Center","Swift","Volcanic","Reliable","Elated","Resonant","Scrawny","Deviant","Striped","Sneaky","Misty","Easy","Breeze","Fanlike","Good","Slimy","Odd","Snobby","Snazzy","Moronic","Rotten","Orderly","Many","Gleaming","Maternal","Divine","Cheering","Narrow","Fresh","Awesome","Glued","Moonlit","Calm","Composed","Twisted","Lame","Sincere","Distinct","Muddy","Cheerful","Likeable","Jolly","Short","Frank","Haunted","Drugged","Horrible","Late","Hesitant","Quick","Barbaric","Ordinary","Chintzy","Bungling","Restless","Stupid","Silly","Healing","Mighty","Head-On","Curly","Artistic","Ugliest","Immodest","Shrill","Annoyed","Morose","Boiling","Shallow","Distant","Deadpan","Angry","Brainy","Evil","Free","Green","Bitter","Fluffy","Vigilant","Husky","Prudent","Dowdy","Steady","Hawaiian","Incisive","Blessed","Unsure","Ratty","Grouchy","Itchy","Keen","Dark","Lively","Chilly","Dry","Icy","High","Clenched","Annoying","Pokey","Super","Dramatic","Heavy","Logical","Shaggy","Testy","Genuine","Eager","Sullen","Stable","Patient","Tricky","Involved","Ghostly","Wary","Healthy","Pensive","Cool","Flashy","Kooky","Dated","Cheesy","Moody","Greasy","Smelly","Bare-Ass","Homely","Stormy","Bad","Witty","Caustic","Timid","Flowing","Clever","Proud","Doubtful","Early","Hearty","Grubby","Polite","Dainty","Stern","Grave","Cautious","Shrewd","Bored","Weak","Idiotic","Low","Steep","Shocking","Elderly","Rough","Hungry","Kind","Striking","Monster","Reserved","Extreme","Modest","Leery","Placid","Ashamed","Chicken","Weary","Mushy","Dusty","Mammoth","Faithful","Sensible","Plain","Sexy","Devoted","Fanciful","Raspy","Young","Brief","Vigorous","Big","Damn","Petulant","Spinning","Prickly","Nervous","Broad","Loyal","Magic","Credal","Smokey","Glinting","Uptight","Slothful","Capable","Petite","Gory","Tender","Triple","Shy","Demonic","Fine","Stained","Upset","Grim","Plucky","Chaotic","Local","Made-Up","Seemly","Numerous","Stale","Colossal","Tight","Ancient","Defeated","Cordial","Juicy","Rainy","Cobwebby","Boney","Sociable","Snooping","Spotless","Succinct","Nosy","Ugly","Harmless","Crucial","Gracious","Resigned","Hot","Joyful","Blushing","Poised","Unstable","Wild","Thankful","Indolent","Purring","Resolute","Stinky","Adorable","Alarming","Lovable","Insane","Hollow","Chic","Damaged","Spastic","Bullying","Worried","Neat","Drooling","Dextrous","Serene","Gigantic","Tough","Alluring","Sulky","Ghoulish","Naked","Mild","Saucy","Cranky","Serious","Plastic","Grieving","Crafty","Sassy","Cultured","Devilish","Direct","Stingy","Numb","Perfect","Mature","Foolish","Groping","Childish","Quiet","Sleepy","Graceful","Roasted","Large","Churlish","Dutiful","Gifted","Demure","Crowded","Well","Fiery","Pretty","Critical","Peevish","Damned","Defiant","Drowsy","Gossipy","Robust","Carved","Creepy","Agile","Spooky","Fast","Blunt","Clean","Gullible","Fuzzy","Liking","Dull","Deep","Dizzy","Quaint","Rare","Musical","Festive","Combined","Sizzling","Masked","Gloomy","Wicked","Broken","Sturdy","Chilling","Envious","Gentle","Stylish","Puny","Amiable","Innocent","Slovenly","Darkish","Pleasant","Somber","Moaning","Hairy","Zany","Sudden","Peaceful","Cute","Harsh","Sweet","Negative","Pointed","Wooden","Ill","Flat","Solid","Shaky","Tactless","Uneven","Obedient","Elfin","Listless","Lusting","Guarded","Dirty","Hateful","Gritty","Cloudy","Excited","Glottal","Alien","Civil","Blinding","Dreadful","Clinical","Detailed","Amicable","Exacting","Playful","Breezy","Thinking","Fat","Surly","Curious","Teasing","Silent","Warm","Diligent","Staid","Precious","Bizarre","Nice","Watery","Painful","Mute","Amused","Picky","Forceful","Handsome","Better","Sour","Modern","British","Subtle","Curved","Howling","Shadowy","Morbid","Dynamic","Abnormal","Skinny","Cruel","Pride","Naughty","Hippie","Little","Comatose","Talented","Tactful","Bushy","Gruesome","Cold","Inactive","Angelic","Giant","Empty","Yummy","Long","Overcome","Evasive","Dashing","Biweekly","Smart","Brave","Lovely","Real","Thrilled","Bold","Blissful","Square","Lucky","Light","Fair","Happy","Tidy","Buff","Silky","Careful","Yellow","Chancy","Cowardly","Charming","Gasping","Candid","Powerful","Afraid","Decisive","Grisly","Smooth","Wrong","Selfish","Clear","Romantic","Cuddly","Clumsy","Loose","Beatable","Positive","Careless","Dazzling","Sedate","Jittery","Touchy","Lonely","Freezing","Warming","Frail","Strong","Colorful","Sneering","Credible","Sloppy","Tranquil","Dead-On","Tolerant","Busy","Thrifty","Upbeat","Nutty","Rich","Farming","Spicy","Salty","Crabby","Relieved","Friendly","Grumpy","Purple","Immature","Zealous","Dead","Smoggy","Immense","Nasty","Beaten","DogLike","Level","Melodic","Candy","Awful","Smiling","Hissing","Tasty","Jealous","Tiny","Fierce","Damp","Sticky","Frantic","Chewable","Staring","Ghastly","Wide","Coherent","Eminent","Slow","Bumpy","Bright","Tall","Awkward","Filthy","Wet","Elegant","Animated","Outgoing","Weird","Hairless","Belated","Bone-Dry","Fusion","Alert","Mean","Faith","Troubled","Handsewn","Fighting","Sore","Humorous","Amazing","Fancy","Open","Revered","Huge","Rapid","Rational","Crazy","Glorious","Fussy","Normal","Massive","Watchful","New","Delicate","Sharp","Honest","Crooked","Eerie","Amusing","Best","Anxious","Discreet","Soulless","Ripe","Intent","Balanced","Punctual","Flaky","Goosey","Willing","Spirited","Loud","Groggy","Spotty","Generous","Amazed","Puzzled","Drunk","Unusual","Flighty","Straight"];
	let word2 = ['Akita','Azawakh','Barbet','Basenji','Beagle','Bloodhound','BlueLacy','Boerboel','Bolognese','Borzoi','Boxer','Briard','Brittany','Bulldog','CanaanDog','CaneCorso','Chihuahua','Chinook','ChowChow','Cockapoo','Collie','Dachshund','Dalmatian','FoxTerrier','Goldador','GreatDane','Greyhound','Harrier','Havanese','Keeshond','Komondor','Kuvasz','Leonberger','LhasaApso','Lowchen','Maltese','Maltipoo','Mastiff','Mudi','Mutt','Otterhound','Papillon','Peekapoo','Pekingese','Plott','Pointer','Pomeranian','Pomsky','Poodle','Pug','Puggle','Puli','RatTerrier','Rottweiler','Saluki','Samoyed','Schipperke','Schnoodle','ShibaInu','ShihTzu','Sloughi','Stabyhoun','Vizsla','Weimaraner','Whippet','Yorkipoo'];

	return (word1[Math.floor((Math.random() * word1.length))] + word2[Math.floor((Math.random() * word2.length))])
}

// We define a route handler / that gets called when we hit our website home.
app.get('/', function(req, res){
	// Send this html file
	res.sendFile(__dirname + '/index.html');
});

// when a user connection event occurs
io.on('connection', function(socket){

	// Log in the user by retrieving them from the list of known users
	socket.on('user login', function(token){
		let user = users.get(token);

		// If this token is recognized
		if (user){	
			console.log(user.username + " (" + user.id + ")" + " reconnected.");

			// Update the socket that its using
			//user.socket = socket;

			user.socketID = socket.id;

			onlineUsers.set(user.id, user);

			// Return the state back to them
			socket.emit('user authed', {
				"user": user,
				"chatlog": chatlog,
				"onlineUsers": namesOf(onlineUsers)
			});
		}
		else {
			// Create a new user if id not found
			genNewUser(socket);
		}

		console.log("Letting others know userlist is changed");
		io.emit('userlist update', namesOf(onlineUsers));
	});

	socket.on('create user', function(){genNewUser(socket);});


	// When a a new chat message is received
	socket.on('new chat msg', function(msg){
		console.log(msg.author.username + " said: " + msg.content);

		// Timestamp it
		let d = new Date();
		let timestamp = d.getHours() + ":" + d.getMinutes();

		// Replace with a fromat string
		chatlog.push("<li>" + timestamp + " " + "<span style=\"color:#" + msg.author.color +"\">" + msg.author.username + "</span> " + msg.content +"</li>");

		// Send that message back to all connected sockets 
		io.emit('update chatlog', {
			"author": msg.author,
			"timestamp": timestamp,
			"content": sanitize(msg.content)
		});
	});

	socket.on('user update', function(user){
		console.log("User attempting to update");

		let oldUser = users.get(user.id);

		users.set(user.id, user);
		onlineUsers.set(user.id, user);

		if (oldUser.username !== user.username){
			io.emit('userlist update', namesOf(onlineUsers));
		}
	});

	// On this socket disconneting
	socket.on('disconnect', function(){
		let dcUserID;

		onlineUsers.forEach( function(value, key, map) { if (value.socketID === socket.id) dcUserID = key; }  );

		if (dcUserID) {
			console.log(onlineUsers.get(dcUserID).username + ' disconnected');
			onlineUsers.delete(dcUserID);
		} else {
			console.log("Non existent user dc?");
		}

		console.log("Letting others know userlist is changed");
		io.emit('userlist update', namesOf(onlineUsers));
	});
});

// We make the http server listen on port 3000
http.listen(3000, function(){
	console.log('listening on *:3000');
});