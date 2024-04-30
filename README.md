# LockedIn

## Overview

Want to focus, and be held accountable? Join a group or an online study session with your friends! It's time to lock in. 

LockedIn is a web app that will allow users to study together using pomodoro techniques. Users can register and login. Once they're logged in, they can access pomodoro timers and different features in order to see their progress over long periods of time.


## Data Model

The application will store Users, Groups and Sessions

* users can have multiple groups (via references)
* groups are a collection of users 
* sessions are objects that contains data about groups, users, study time, etc.

An Example User:

```javascript
{
  username: "student",
  hash: // a password hash,
  groups: // an array of groups
  friends: // an array of friends
  sessions: //array of sessions
}
```

An Example Session with Embedded Items:

```javascript
{
  user: // a reference to a User object
  name: "",
  date: //date
  friends: [
    { name: "bob"},
    { name: "john"},
  ],
  started: // timestamp
  ended: // timestamp
}
```


## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/home/profile - page for personal profile

![home profile](documentation/home-profile.png)

/home - homepage

![home](documentation/home.png)

/session/id - page for specific sessions

![home session](documentation/home-session.png)


## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

Here is my sitemap: 
![sitemap](documentation/site-map.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new session
4. as a user, I can view all of the available sessions in a single list, as well as recent data
5. as a user, I can see my own profile and others' profiles, and everybody's progress
6. as a user, I can interact with a current session

## Research Topics

* (6 points) Use a Front End Framework
    * Using ReactJS
* (3 points) Unit Testing with JavaScript
    * Using Mocha and Chai to unit test 
* (2 points) tailwind.css
    * Use a CSS framework or UI toolkit, use a reasonable of customization of the framework (don't just use stock Bootstrap - minimally configure a theme)

11 points total out of 10 required points 

## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

none so far