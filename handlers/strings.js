const path = require("path");
const { I18n } = require('i18n');
//Initiate i18n globally to produce list of available translations.
const i18n = new I18n({
  directory: path.join(__dirname, "..", "translations"),
});

//Translate function to fetch localised messages
function translate(key, message, locale) {
  //Register message as an i18n object
  const i18n = new I18n({
    directory: path.join(__dirname, "..", "translations"),
    register: message
  });

  //Defer to help assembler - this is in a bad position - doesn't check if the locale exists first.
  if(key === "HELP_MESSAGE" && i18n.getLocales().includes(locale)) {
    return helpAssembler(message, locale);
    //english fall back
  } else if (key === "HELP_MESSAGE" && !i18n.getLocales().includes(locale)) {
    return helpAssembler(message, "en");
  }
  //Check if locale exists
  if(i18n.getLocales().includes(locale)) {
    return message.__({phrase: key, locale: locale});
  } else {
    return message.__({phrase: key, locale: 'en'});
  }
}

function helpAssembler(message, locale) {
  var str = ""
  return str.concat("```", message.__({phrase: 'help1', locale: locale}),
  "\n---------------------------\n",
  message.__({phrase: 'help2', locale: locale}), "\n",
  message.__({phrase: 'help3', locale: locale}), "\n",
  message.__({phrase: 'help4', locale: locale}), "\n",
  message.__({phrase: 'help5', locale: locale}), "\n",
  message.__({phrase: 'help6', locale: locale}), "\n",
  message.__({phrase: 'help7', locale: locale}), "\n",
  message.__({phrase: 'help8', locale: locale}), "\n",
  message.__({phrase: 'help9', locale: locale}), "\n",
  message.__({phrase: 'help10', locale: locale}), "\n",
  message.__({phrase: 'help11', locale: locale}), "\n",
  message.__({phrase: 'help12', locale: locale}), "\n",
  message.__({phrase: 'help13', locale: locale}), "\n",
  message.__({phrase: 'help14', locale: locale}), "\n",
  message.__({phrase: 'help15', locale: locale}), "\n",
  "```", "Visit https://nilesbot.com/ for more information."
  );
}


const HELP_MESSAGE = "```\
        Niles Usage\n\
---------------------------\n\
!display             -  Display your calendar\n\
!update / !sync      -  Update the Calendar\n\
!create / !scrim     -  Create events using GCal's default interpreter - works best like !scrim xeno June 5 8pm - 9pm\n\
!delete              -  Delete an event using the form !delete <event_title>, ONLY works when the title matches the one in Google Calendar\n\
!clean / !purge      -  Deletes messages in current channel, !clean <number>\n\
!stats / !info       -  Display list of statistics and information about the Niles bot\n\
!invite              -  Get the invite link for Niles to join your server!\n\
!setup               -  Get details on how to setup Niles\n\
!id                  -  Set the Google calendar ID for the guild\n\
!tz                  -  Set the timezone for the guild\n\
!prefix              -  View or change the prefix for Niles\n\
!displayoptions      -  Change formatting of the calendar display\n\
!admin               -  Restrict the usage of Niles to a specific role\n\
!help                -  Display this message\n\
```\
Visit http://nilesbot.com for more info.";

const NO_CALENDAR_MESSAGE = "I can't seem to find your calendar! This is usually because you haven't invited Niles to access your calendar, run `!setup` to make sure you followed Step 1.\n\
You should also check that you have entered the correct calendar id using `!id`.\n\
\nIf you are still getting this error join the Discord support server here: https://discord.gg/jNyntBn";

const SETUP_HELP = "```\
        Niles Usage - SETUP MODE\n\
---------------------------\n\
NOTE: ALL COMMANDS BECOME AVAILABLE AFTER SETUP IS COMPLETE\n\
!setup               -  Get details on how to setup Niles for use.\n\
!prefix              -  View or change the prefix for Niles\n\
!id                  -  Set the Google calendar ID for the guild\n\
!tz                  -  Set the timezone for the guild\n\
!adminrole           -  Restrict the usage of Niles to a specific role\n\
!help                -  Display this message\n\
```\n\
Visit http://nilesbot.com/start for more info.";

const SETUP_MESSAGE = "\
Hi! Lets get me setup for use in this Discord. The steps are outlined below, but for a detailed setup guide, visit http://niles.seanecoffey.com/start \n\
\n1. Invite `niles-291@niles-169605.iam.gserviceaccount.com` to \'Make changes to events\' under the Permission Settings on the Google Calendar you want to use with Niles\n\
2. Enter the Calendar ID of the calendar to Discord using the `!id` command, i.e. `!id 123abc@123abc.com`\n\
3. Enter the timezone you want to use in Discord with the `!tz` command, i.e. i.e. `!tz America/New_York` or `!tz UTC+4` or `!tz EST` No spaces in formatting.\n\
\n Niles should now be able to sync with your Google calendar and interact with on you on Discord, try `!display` to get started!";

const RESTRICT_ROLE_MESSAGE = "\
You can restrict who can control Niles and the associated Google Calendar with roles. \n\
Niles will only allow one role to be used, and it must have a unique name. \n\
The person assigning the restriction must have the role being assigned. \n\
i.e. Create a role called *Scheduler*, and then tell Niles to only allow people with that role using `!admin Scheduler` (case sensitive)\n\
**Warning - Experimental Feature - Please go to the Niles discord server and post if you have any issues with this feature**";

const DISPLAYOPTIONS_USAGE =
`**displayoptions USAGE**\`\`\`
    COMMAND                      PARAMS        EFFECT
    !displayoptions help         (0|1)         hide/show help
    !displayoptions pin          (0|1)         pin calendar message
    !displayoptions format       (12|24)       12h or 24h clock display
    !displayoptions tzdisplay    (0|1)         hide/show timezone
    !displayoptions emptydays    (0|1)         hide/show empty days
    !displayoptions showpast     (0|1)         hide/show today's past events
    !displayoptions trim         (n)           trim event names to n characters (0 = off)
    !displayoptions days         (n)           number of days to display (max 90)
    !displayoptions style        (code|embed)  use old or new event display style (see niles.seanecoffey.com/customisation)
    !displayoptions inline       (0|1)         makes embed display inline (see niles.seanecoffey.com/customisation)
    !displayoptions description  (0|1)         hide/show event description (only compatible with embed)
    \`\`\`
    `;

module.exports = {
  HELP_MESSAGE,
  NO_CALENDAR_MESSAGE,
  SETUP_MESSAGE,
  SETUP_HELP,
  RESTRICT_ROLE_MESSAGE,
  DISPLAYOPTIONS_USAGE,
  translate,
  i18n
};
