## SparkPost Developer Hub Raffles

This is a small app that consumes inbound email from the [sparkies](http://github/com/Sparkpost/sparkies) relay webhook database and interprets it as a set of raffle entries.

Each recipient address localpart represents a raffle and each received email represents an entrant to that raffle.

For example, when the app receives the following email:

```
From: bob@entrant.com
To: winstuff@hey.avocado.industries
Subject: Pick Me!
```

...it interprets it as an entry to the `winstuff` raffle by `bob@entrant.com`.

##Prerequisites
- Node (tested on 0.12)
- PostgreSQL
- Heroku toolbelt (optional)

## Installation/Configuration/Running Locally

```bash
$ git clone http://github.com/Sparkpost/raffles
```

### Using Heroku

Find the Sparkies app's heroku-postgresql addon name:

```bash
$ heroku addons
```

Create a Heroku app, attach the Sparkies heroku-postgresql addon, configure the app and push:
```bash
$ heroku create
$ heroku addons:attach <sparkies heroku-postgresql addon name> -a <your app name> --as WEBHOOK_CONSUMER_DB
$ heroku config:set RCPT_DOMAIN=hey.avocado.industries
$ git push heroku master
```

You can now access the app from https://<your-app-domain>/raffles

### Running Locally

Create a local sparkies database.  Note: this creates a Postgres DB named `avocadomail`:
```$ bash
psql << avocadomail.sql
```

Edit config/default.json to point to your local database:
```json
{
  "maildburl": "postgres://yourlogin@localhost/avocadomail",
  ...
}
```

Start the app locally:
```bash
npm run web
```

### API Usage
- /raffles - list raffles:
```bash
$ curl -s http://localhost:5000/raffles | jq .
```
```json
{
  "results": [
    {
      "localpart": "dgray",
      "cnt": "2"
    },
    {
      "localpart": "ewan",
      "cnt": "1"
    }
    ]
}
'''

- /raffles/:raffleId - summarise entries for a raffle:
```bash
$ curl -s http://localhost:5000/raffles/dgray | jq .
```
```json
{
"results": {
"num_entries": "2",
  "first_received": "2016-01-26T16:46:30.982Z",
    "last_received": "2016-01-26T16:46:30.984Z"
  }
}
```

- /raffles/:raffleId/winner - pick a winning entrant for a given raffle:
```bash
$ curl -s http://localhost:5000/raffles/dgray/winner | jq .
```
```json
{
  "results": {
    "winner_address": "dgray@sparkpost.com",
    "winner_sent_at": "2016-01-26T16:46:30.984Z"
  }
}
```
