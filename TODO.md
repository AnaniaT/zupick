# TODO LIST

```
Note: This is just an informal way to track your progress. This mainly helps not to forget some nessecary steps that were skipped at the time of updating this file. Peace out.
```

The fab button on the core page has a badge and its UI will be ruined for 3 digit numbers. It is unrealistic for these numbers to come up, however it is worth mentioning.

You better limit the characters(length of text) as follows.

- Name of food item => 25 chars
- Description of food item => 175 chars
- Restaurant name => 25 char
  This makes it fit on the pixel 2 but for smaller devices you must handle overflowing text so as to keep the UI fine. THIS IS A MUST THING TO DO. (YOU COULD USE JS AND ngAfterViewChecked LIFE CYCLE, partially implemented on the descrption on the item page. see item.page.ts)

Alert:

On the cart page the total updates as you click the controls however it seems working it is not actually. This is happening because both the service and the cart are refering to the same cart list (object) in memory, which will not be great after implmenting a real database.

Idea:

You could use ion-skeleton-text to simulate loading of the items page, cart page, home or any page that seem posible. For the home page you could use it when loading the categories with the item list for the first time and when changing categories. => DONE!! (Excluded the cart instead used spinner there)
