# Project: Kreddit

## What is this

- This is an discussion website imitating Reddit, 
  within which has a set of basic functionality to prove my understanding of Javascript and scss

- Online: https://kreddit-d2cd8.firebaseapp.com/
- Local:  http://localhost:3000/

## What does this have

### As user

- You can create user by nickname(immutable) and password.
- You can toggle showing your input password.
- You can choose nation and gender.
- You can change your icon.
- You can search for what you like.
- You can edit your password.
- You can delete your account.

### By group

- You can join in groups.
- You can create group(4 for most).
- You can upload group symbol.
- You can see when the group were created.
- You can jump to certain group's discussions.

### For discussion

- You can create, edit, delete your own discussions.
- You can sort discussions by group.
- You can upload images to discussions.
- You can rate discussions.
- You can create subdiscussions on any discussions.
- You can receive notification about your discussions.
- You can see when the discussions were created.

### Upon environment

- You can log in as a human.
- You can switch between light mode and dark mode.
- You can discuss on smartphone comfortably.
- You can discuss on various browsers.

## Database structure

### Firestore
  Data structure
  groups - Anime -         content             - discussions - 0  1  2    - subdis - 0   1   2   3  
  -  creator symbol introduction time  -            -  title time  -             - content uid rating -        - content uid rating

  user-info    -  notif - 0  - from: uid  content: what to do?
  user-info    -    created-groups   -   name array creator
  user-info    -    joined-groups   -   
                -     created-discussions    - database position

### Firestorage

discussion-image

group-symbol group-name

user-icon  uid

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
$ npm run
```

- Browse content
```ruby
$ https://localhost:3000
```

### Test Account

- nickname: 123456
- Password: 123456




