# [Cowrie](https://github.com/cowrie/cowrie) logs analysis
Credentials used by threat actors were harvested for 2 months on digitalocean free trial VPS. Results and statistics can be found in this repository.

# How to analyse your cowrie logs:

Copy cowrie_parser.js and passwords.js to directory where your logs are located, then in terminal:
```sh
node cowrie_parser.js
node passwords.js
```
Results will be stored in /passwords/ and /usernames_passwords/ directories.

