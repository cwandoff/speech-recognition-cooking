This is a [Next.js](https://nextjs.org/) project.


## Dependencies

- Node JS `^16.0`
  - Can be installed through Homebrew or via NVM (which can also be installed via Homebrew)
- Yarn `^1.22`
  - Can be installed by running `npm install -g yarn`

## Getting Started

``` 
.env.local file will be added soon
```

/////////////////////////////////////////////////////////////////
First, set environment variables, using either actual environment varaibles or an `.env.local` file.
/////////////////////////////////////////////////////////////////

Next, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Current state

The current state of this project is very underwhelming when compared to what it will be. As of now, this tool is only configured and has very basic visual elements that mimic the color scheme of Delta Tau Delta.

I am currently trying to create a favicon for the tool as well as implementing a logo we can use within the project

### Building

To build and generate static assets, just run:

```bash
yarn build
```

### API routes

No API implementation as of yet

Google Sheets API as well as Notion API are expected to be used in order to read IFC data (Google Sheets) and read & write data to Notion.so

There is currently a Notion.so account that has been set up for a single user because a team account is not free

Future implementation of the Notion.so API integration will be required for easy reading & writing of data. Information concerning this implementation can be found here: https://developers.notion.com/docs/getting-started

Any Google Sheets implementation will involve using Google's developer API. Information concerning this implementation can be found here: https://developers.google.com/sheets/api/guides/values#node.js 

## Deploy

Currently no deployment for this project

A vercel deployment will be created as the project moves along

## Testing

Testing happens with Jest and React Testing Library to run the tests in watch mode run

```bash
yarn test
```

From here you can update snapshots, run all of the tests, or filter and run just a few.

To run the tests one off just run

```bash
yarn test-ci
```


