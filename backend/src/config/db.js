const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js DNS resolver to use reliable DNS servers (Google/Cloudflare)
// to fix querySrv ECONNREFUSED issues on local networks.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!connStr) {
      throw new Error('MONGO_URL or MONGO_URI is not defined in the environment variables');
    }

    // Parse host from connection string
    let host = 'unknown';
    let safeConnStr = connStr;
    try {
      const match = connStr.match(/@([^/?#]+)/);
      if (match) {
        host = match[1];
      }
      safeConnStr = connStr.replace(/:([^@:]+)@/, ':****@');
    } catch (e) {
      console.error('Failed to parse connection string for logging', e);
    }

    console.log(`Attempting to connect to MongoDB...`);
    console.log(`Connection string (masked): ${safeConnStr}`);
    console.log(`Extracted host: ${host}`);

    // If it's an srv record, do srv lookup, otherwise do normal lookup
    if (connStr.startsWith('mongodb+srv://')) {
      const srvHost = `_mongodb._tcp.${host}`;
      console.log(`Performing DNS SRV resolution lookup for: ${srvHost}`);
      dns.resolveSrv(srvHost, (err, addresses) => {
        if (err) {
          console.error(`DNS SRV Lookup failed for ${srvHost}:`, err);
        } else {
          console.log(`DNS SRV Lookup succeeded. Addresses:`, addresses);
        }
      });
    } else {
      console.log(`Performing normal DNS lookup for: ${host}`);
      dns.lookup(host, (err, address, family) => {
        if (err) {
          console.error(`DNS standard lookup failed for ${host}:`, err);
        } else {
          console.log(`DNS standard lookup succeeded. IP: ${address}, Family: IPv${family}`);
        }
      });
    }

    const conn = await mongoose.connect(connStr);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error Details:');
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
