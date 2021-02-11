const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");
const { oauth2, sa } = require("../settings.js");
const helpers = require("./helpers.js");

const emptyCal = {
  "day0": [],
  "day1": [],
  "day2": [],
  "day3": [],
  "day4": [],
  "day5": [],
  "day6": [],
  "lastUpdate": "",
  "calendarMessageId": ""
};

// default guild settings
const defaultSettings = {
  "prefix": "!",
  "calendarID": "",
  "calendarChannel": "",
  "calendarName": "CALENDAR",
  "timezone": "",
  "helpmenu": "1",
  "format": 12,
  "tzDisplay": "0",
  "allowedRoles": [],
  "emptydays": "1",
  "showpast": "0",
  "trim": 0,
  "days": 7,
  "style": "code",
  "inline": "0",
  "description": "0",
  "url": "0",
  "auth": "sa",
  "channelid": "",
  "descLength": 0,
  "startonly": "0",
};

/**
 * Delete folder recursively
 * @param {String} path 
 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, {recursive: true});
  }
}

/**
 * Writes guild-specific setting
 * @param {String} guildID - ID of guild to write setting to 
 * @param {Object} json - json array of values to write
 * @param {String} file - file name to write to - calendar/settings 
 */
function writeGuildSpecific(guildID, json, file) {
  let fullPath = path.join(__dirname, "..", "stores", guildID, file + ".json");
  fs.writeFile(fullPath, JSON.stringify(json, "", "\t"), (err) => {
    if (err) return helpers.log("error writing guild specific database: " + err);
  });
}

/**
 * Create new guild files
 * @param {String} guildID - Guild to create files for
 */
function createGuild(guildID) {
  const guildPath = path.join(__dirname, "..", "stores", guildID);
  if (!fs.existsSync(guildPath)) { // create directory and new files
    fs.mkdirSync(guildPath); 
    writeGuildSpecific(guildID, emptyCal, "calendar");
    writeGuildSpecific(guildID, helpers.defaultSettings, "settings");
    helpers.log(`Guild ${guildID} has been created`);
  }
}

/**
 * Delete guild settings
 * @param {String} guildID - guild to delete configuration for
 */
function deleteGuild(guildID) {
  const guildPath = path.join(__dirname, "..", "stores", guildID);
  deleteFolderRecursive(guildPath);
  helpers.log(`Guild ${guildID} has been deleted`);
}

/**
 * Delete and recreate guild settings
 * @param {StringDecoder} guildID 
 */
function recreateGuild(guildID) {
  deleteGuild(guildID);
  createGuild(guildID);
}

/**
 * Try and read file
 * @param {String} path - path of file to read
 */
function readFile(path) {
  try { return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (err) {
    helpers.log("error reading file " + err);
    return {}; // return valid JSON to trigger update
  }
}

function getGuildSpecific(guildID, file) {
  let filePath = path.join(__dirname, "..", "stores", guildID, file);
  let storedData = readFile(filePath);
  // merge defaults and stored settings to guarantee valid data - only for settings
  return (file === "settings.json" ? {...defaultSettings, ...storedData} : storedData);
}

function Guild(guildID) {
  // settings
  let settings = getGuildSpecific(guildID, "settings.json");
  /**
   * Get settings
   * @param {String} [key] - Optional key to fetch 
   */
  this.getSetting = (key) => {
    return (key ? settings[key] : settings);
  };
  /**
   * Sets specific setting to value
   * @param {String} key - key of setting to change
   * @param {String} value - value to set key to
   */
  this.setSetting = (key, value) => { // set settings value
    settings[key] = value;
    writeGuildSpecific(guildID, settings, "settings");
  };
  /**
   * Set all settings
   * @param {Object} newSettings - new settings object
   */
  this.setSettings = (newSettings) => { writeGuildSpecific(guildID, newSettings, "settings"); };
  // common settings
  this.prefix = settings.prefix;
  this.id = guildID;
  this.tz = settings.timezone;
  this.locale = settings.locale;
  // calendar
  let calendar = getGuildSpecific(guildID, "calendar.json");
  /**
   * Get calendar file
   * @param {String} [key] - Optionally get specific key 
   */
  this.getCalendar = (key) => { return (key ? calendar[key] : calendar); };
  /**
   * Set Calendar to value
   * @param {Object} [argCalendar] - If provided, set to given calendar, else write current calendar
   */
  this.setCalendar = (argCalendar = calendar) => {
    writeGuildSpecific(guildID, argCalendar, "calendar");
    calendar = argCalendar;
  };
  // calendarID
  /**
   * Set Calendar Message ID
   * @param {String} calendarID - ID of calendar message 
   */
  this.setCalendarID = (calendarID) => {
    calendar.calendarMessageId = calendarID;
    this.setCalendar();
  };
  // daymap
  this.getDayMap = () => {
    let dayMap = [];
    // allowing all days to be correctly TZ adjusted
    let d = DateTime.fromJSDate(new Date()).setZone(this.tz);
    // if Option to show past events is set, start at startOf Day instead of NOW()
    if (settings.showpast === "1") d = d.startOf("day");
    dayMap[0] =  d;
    for (let i = 1; i < settings.days; i++) {
      dayMap[i] = d.plus({ days: i }); //DateTime is immutable, this creates new objects!
    }
    return dayMap;
  };
  /**
   * Get OAuth2 token
   */
  this.getToken = () => getGuildSpecific(guildID, "token.json");
  /**
   * Set OAuth2 token
   * @param {Object} token - token object to write
   */
  this.setToken = (token) => writeGuildSpecific(guildID, token, "token");
  /**
   * Gets guild authentication
   * @returns return googleAuth object
   */
  this.getAuth = () => {
    if (settings.auth === "oauth") {
      oauth2.setCredentials(this.getToken());
      return oauth2;
    // default to SA if oauth2 failed too
    } else { return sa;
    }
  };
}

module.exports = {
  Guild,
  createGuild,
  deleteGuild,
  recreateGuild
};