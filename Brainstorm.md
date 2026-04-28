PAUL EMAIL DESCRIPTION:


Paul Midgley
Mar 4, 2026, 7:08 AM
to Mustang, Hannah, me

My thoughts on what needs to go in the email.

Announcing an exciting  new fundraising initiative, Mustang Update An Event program.

Sell it first…why we need the funds-many things not covered in our budget allocation, massage, training camps, coaching, recruiting, AFA’s, high performance competitions…other? Some testimonials on what it means to the team would be great.

Then got to the sell part. Individual entries $500 per got to general fund, $1000 per relay go to High Performance fund. Event adoption can be done by an individual or multiple people can get together to adopt an event. Program runs from April 15(?) till November 2027. Adopters of an event will get web publication, pool deck/stands notification, program notification at 2027 Division Championships.

Then need to explain how it works. I’ll leave that part to you.

Thanks

Paul
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Paul being Paul it wasn't much clearer when I met with him in person. Annoyingly the other captains were there too interjecting and trying to explain to me how to build
it; people I'm not worried about whether I can build it or not, I'm trying conduct requirements elicitation so I can build the way Paul invisions it. Anyway, I guess I'll work with what I've got for now. This will keep me busy this week since I'm not really starting schoolwork until after my birthday anyway.

So what I gathered was he just wants a basic webpage with a catalogue of all of the individual events + relays. You can click on an event, say 100 breaststroke for example, and clicking that adopt link will take you directly to the adopt a mustang page: https://www.westernconnect.ca/site/SPageNavigator/donation/giveAthletics.html
That makes things simple because then I don't have to build any backend for handling the payments or anything that's completely out of my hands. This is essentially going to be a JS only UI project (with some exceptions). He also wants to have the page update automatically if somebody adopts an event (i.e. cross it out as puurchases already) so that users don't buy something someone else has already purchased. If someone clicks on one that has been purchased already, they should be presented with 2 other options to buy instead, preferably in the same stroke.

Obviously since it's out of our hands once they get the official adopt a mustang website, we should leave them some basic instructions.
    - Select SWIMMING from the area of support dropdown (most important)
    - Select $500 for individual event
    - Click other amount for relay and enter $1000
    - If doing a conjoined purchase, split up accordingly with your co-purchasers
    - Fill up contact information accurately and choose relationship

Of course every event on the page is tied to the same link, but there are some actions we need on our backend still.
    - Onclick of specific event, need it to be crossed off (what's the best way to know if they actually paid since we don't see the money come in on our end?)
    - Onclick && taken already --> suggestions

