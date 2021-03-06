# Project: Kreddit

- Part of Odin Project: JavaScript Final Project.
- Class URL: https://www.theodinproject.com/paths/full-stack-ruby-on-rails/courses/javascript/lessons/javascript-final-project

## What is this

- This is a discussion website imitating Reddit, 
  within which has a set of basic functionality to prove my understanding of Javascript and SCSS

- Online: https://kreddit-unpublic-d62c1.web.app/
- Local:  http://localhost:3000

## What does this have

### As user

- You can create user by nickname(immutable) and password.
- You can toggle showing your input password.
- You can choose nation and gender.
- You can change your icon.
- You can search for what you like.
- You can edit your password.
- You can delete your account.
- You can see what discussions were created.

### By group

- You can join in groups.
- You can create group(4 for most).
- You can give group a brief introduction.
- You can upload group symbol.
- You can see when the group were created.
- You can toggle group view.
- You can jump to group's discussions.

### For discussion

- You can create, edit, delete your own discussion.
- You can sort discussions by group.
- You can upload images to discussions.
- You can rate discussions.
- You can create subdiscussions on any discussions.
- You can receive notification about your discussions.
- You can see when the discussions were created.
- You can check creator's profile by clicking icon.

### Upon environment

- You can log in as a human.
- You can receive tips about your action.
- You can switch between light mode and dark mode.
- You can discuss on smartphone comfortably.
- You can discuss on various browsers.

## Database structure

### Firestore

<img src="https://raw.githubusercontent.com/RistoLibera/Kreddit/main/src/assets/database/database.png" width="400"/>

### Firestorage

discussion-title-image/ + title-name/ + img.jpg

group-symbol/ + group-name/ + symbol.jpg

user-icon/ + uid/ + icon.jpg

## Initial Setup

### Getting start

- Clone repository
```ruby
$ git clone git@github.com:RistoLibera/Kreddit.git
```

- Install node_modules
```ruby
$ npm install
```

- Create server
```ruby
$ npm start
```

- Browse content
```ruby
$ https://localhost:3000
```
