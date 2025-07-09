import Parse from 'parse';

Parse.initialize(
  process.env.NEXT_PUBLIC_PARSE_APP_ID as string,
  '', // JS Key (optional, not needed for most Back4App setups)
  ''  // Master Key (never use in frontend)
);
Parse.serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL as string;

export default Parse; 