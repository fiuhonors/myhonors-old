# MyHonors

Developed for [The Honors College at Florida International University](http://honors.fiu.edu/).

MyHonors currently features an Events Calendar, Attendance Tracker, Citizenship Tracker, and an Honors College Application. It's **fast**. It's **modern**. And it's designed to be **100% responsive for use on phones, tablets, and other mobile devices**. To get a taste of what we're planning, see our Roadmap in the Development section below.

## Installation
We use the [CodeIgniter](http://ellislab.com/codeigniter/) PHP framework to handle data from the backend and [AngularJS](http://angularjs.org/)--an amazing Javascript framework from Google--to power the frontend. Our HTML & CSS code is based on [Twitter Bootstrap](twitter.github.com/bootstrap/).  All necessary files are already included in the repository, so you can get started with just a few steps:

1. [Download](https://github.com/sergiopantoja/MyHonors/archive/master.zip) or [clone](https://github.com/sergiopantoja/MyHonors) the MyHonors repository and upload the files to your webserver.
2. Rename **application/config/config.sample.php** to **config.php**. Set your base URL and create a random encryption key.
3. Rename **application/config/database.sample.php** to **database.php**. Add your database information.
3. Rename **application/config/tank_auth.sample.php** to **tank_auth.php**. Change 'webmaster_email' and any other settings as needed.
4. Rename **assets/js/config.sample.js** to **config.js**. Add all necessary information (see file for more details).
5. Make sure the **captcha** folder is writable by the web server.
6. *More instructions coming soon. Go to an install page to populate the database, setup auth settings (CAS?), etc.*

## Development

###Roadmap
| Version |     | Description |
|---------|-----|-------------|
| **0.x** |     | Adding existing features into repo |
|         | 0.1 | Attendance and Events |
|         | 0.2 | User Profiles under Tank\_Auth |
|         | 0.3 | Linked Authentication with phpCAS and LDAP |
|         | 0.4 | Application |
|         | 0.5 | ARCH Registration |
| **1.x** |     | Adding Social features |
|         | 1.1 | Text posts and comments |
|         | 1.2 | Photo posts, comments, and captions |
|         | 1.3 | Private Messages |
|         | 1.4 | Automated Messages |
| **2.x** |     | Groups |
|         | 2.1 | Creating and joining groups |
|         | 2.2 | Browsing Groups |
|         | 2.3 | Managing Groups |
|         | 2.4 | Using Group filters |
