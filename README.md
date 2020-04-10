# IPTV Playlist Constructor

![IPTVPLC logo](https://shcherbadev.github.io/images/iptvplc_logo.png)

## About project

IPTVPLC (IPTV Playlist Constructor) allows you to create and edit `.m3u` and `.m3u8` files using comfortable user interface.

## Achievements

This project became a winner in the 6th season of the all-Ukrainian contest "iTalent" in "WEB Application" nomination.

![iTalent logo](https://italent.org.ua/includes/images/logos/iTalent_logo_vertical.svg)
*iTalent logo*

![Me with diploma and prizes just after rewarding](https://scontent.fiev27-1.fna.fbcdn.net/v/t1.0-9/p720x720/79724888_534550830459592_636425578156654592_o.jpg?_nc_cat=111&_nc_sid=110474&_nc_ohc=3hZxYI3mWbIAX_pinXV&_nc_ht=scontent.fiev27-1.fna&_nc_tp=6&oh=fa56d64aa988c54a93576335d34343ea&oe=5EB51B47)
*Me with diploma and prizes just after rewarding*

## Development

### Preparing .env file for development

Create a copy of `.env.example` file which is located in `environments` folder and rename it to `.env.development`.

Set the `NODE_ENV` variable to `development`. The other variables might ask you for API keys, database and email data.

### Preparing .env file for production

Do the same instructions as were described in *Preparing .env file for development* section, but set the `NODE_ENV` variable to `production`.

### Installing dependencies

For installing the required dependencies run in terminal `npm install`.

### Starting project

To start the project run `npm run dev`.

### Code style checking

To check the code style run `npm run lint`. This command is also running for `npm run build` command.

`npm run lint:fix` is doing the same things as `npm run lint` but it's doing fixes in the code style errors (if possible).

## Building a production build

To build a production version of project type `npm run build` in the terminal.

Before building, the system will run `npm run lint` to check the code style.

Output files will be created in the `dist` folder.

## Notes

### What is happening with this project now?

Currently, this project is finished and I don't see it necessary to continue to develop it. That's why I published this project to Github.
