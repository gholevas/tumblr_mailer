//required modules
var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
//read files
var emailTemplate = fs.readFileSync('email_template.ejs','utf8');
var csvFile = fs.readFileSync('friend_list.csv','utf8');

//create tumblr client
var client = tumblr.createClient({
  consumer_key: 'yoQC92PlwFbyOCtuFAQQUY9fwjIeaCo3JRu1q7BemaAkKXlPkD',
  consumer_secret: 'RNzm1wfFyUK81nQ2Whv6Hw6NMFsTh2xBHfC62vAzRt9YIiR91Q',
  token: 'uG8uK4B5z9ZdwvI68AO6ODpU5J4HB4Gr8McBLXldvHMisQA07Z',
  token_secret: 'SMbipPwrT1VeMbG7OZuK9KYqWvEkUnX6g8CCDszi6kPL7gvGFr'
});

//function that takes posts array as input and returns array of posts that were posted in last 7 days
function recentPosts(posts){
	var recents = []; //initialize empty array of recent posts
	for(var i = 0; i < posts.length; i++) { //iterate over input posts array
		var createdAt = new Date(posts[i].date); //create date object from when post was made
		var currentDate = new Date(); //create date object for current date
		var difference = currentDate - createdAt; //calculate difference
	    if(difference < 604800000){ //milliseconds in 1 week
			recents.push(posts[i]); //add post to recents array if it was posted within 7 days
		}
		return recents;
	};
}
//function that accepts string output after reading csvFile and returns an array of objects
function csvParse(csvFile){
  var myArr=csvFile.split("\n"); //split initial spring into an array using new line character as delimiter
  var answer = []; //initiate empty array for parsed csv
  var keys=myArr[0].split(","); //set keys variable equal to an array of the first row in csv file

  for(var i=1;i<myArr.length;i++){  //iterate over the array that was split by new line character
	  var myObj = {};	//initate empty object for each row
	  var currentRow=myArr[i].split(",");  //split each row into array using comma delimitter
	  for(var j=0;j<keys.length;j++){ //iterate over the keys array
		  myObj[keys[j]] = currentRow[j]; //set the object's keys to their respective values
	  }
	  answer.push(myObj);  //push each of these objects onto answer array
  }
  return answer; //return parsed array
}


//tumblr api call
client.posts('gholevas.tumblr.com', function(err, blog){
    var templateCopy = emailTemplate; //create a copy of the email template 
    var friendList = csvParse(csvFile); //create a variable to hold the parsed csv file
    var allPosts = blog.posts; //create a variable to hold all of the blog posts returned from the api call
    var latestPosts = recentPosts(allPosts); //call the recentPosts function to filter out blog posts older than 7 days

	friendList.forEach(function(row){  //loop through each contact in the csv file
		var firstName = row["firstName"];  //set variable firstName
	    var numMonthsSinceContact = row["numMonthsSinceContact"]; //set variable numMonthsSinceContact
		var customizedTemplate = ejs.render(templateCopy,{ //customize template for each email by passing the variables to the ejs templating framework
			 firstName: firstName,
			 numMonthsSinceContact: numMonthsSinceContact,
			 latestPosts: latestPosts 
		});
	    console.log(customizedTemplate);  //log each of these templates since we are not sending emails because Mandrill api changed terms
	})
})








