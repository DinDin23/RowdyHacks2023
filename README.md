# RowdyHacks2023

Current branch: cloud

Inspiration

We wanted to do something 90s themed. One of our teammates rollerbladed over Spring Break, so it was rollerblading themed. We also wanted to do a multiplayer game.

What it does

NeonBlader is a multiplayer web-based rollerblading racing game.

How we built it

We used several platforms to build the app - for front end, we used primarily ReactJS and used ThreeJS's React port (called React3Fiber) for graphics, and for back end, we used Google Cloud, React, and Websockets to create the multiplayer experience, and MongoDB for storing user data. We also used blender to create models for the game.

Challenges we ran into

We originally started with normal JavaScript and ThreeJS for graphics, but eventually we wanted to port to React. It was a nuisance to understand how the ThreeJS code we wrote would translate into React, and since a majority of us were new to React, it was difficult to port the code. Another issue was getting the players to be able to talk to each other in the Cloud.

Accomplishments that we're proud of

We're proud of being able to get multiplayer up and running in this time frame since none of us have done it before. We're also proud of our graphical capabilities using ThreeJS.

What we learned

We learned that React libraries that intend to port direct functionality can be really painful. We also learned that we were too ambitious with our original ideas.

What's next for NeonBlader

Multiple tracks, smoother netplay, minigames!
