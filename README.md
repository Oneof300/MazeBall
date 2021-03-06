# MazeBall
Tilt the platforms to move the ball to the final platform but be aware of the special obstacles.

repository:  
https://github.com/Oneof300/MazeBall

Github-Pages app:  
https://oneof300.github.io/MazeBall/

source code:  
https://github.com/Oneof300/MazeBall/tree/main/scripts

concept (german):  
https://github.com/Oneof300/MazeBall/blob/main/concepts/Maze_Ball_Konzept.pdf

project folder:  
https://github.com/Oneof300/MazeBall/archive/refs/heads/main.zip

## Manual
Your goal is to move the red ball to the final platform wich is highlighted with a green color. To move the ball there you
need to tilt the platforms. But you not only want to reach the final platform, you also want to get there as fast as possible.
The current time that has passed can be seen at the top right corner of the window. After you solved the maze by
reaching the final platform you're asked to enter your name, to enlist your time in the highscore-list with the given name.
By pressing enter your time will be saved and the maze gets resetted.


Start-Menu:
- "Play" leads you to the game
- "Highscores" leads you to the hisghscore table

In-Game-Controls:
- You always control one platform
- Move your mouse to tilt the platform
- Scroll with your mousewheel to rotate the platform
- The controlled platform is swapped when the ball hits the floor of another platform than the current controlled platform
- Press escape to open the In-Game-Menu and pause the game
- Press enter to reset the game when it's running

In-Game-Menu:
- "Start" leads you to the Start-Menu
- "Highscores" leads you to the highscore table

### Installation
To install Maze Ball you need to download a zip-compressed release from
https://github.com/Oneof300/MazeBall/blob/main/releases. Extract the zip-file and run MazeBall.bat to run the game.
In order to be able to run the game node.js is required, which can be downloaded from https://nodejs.org/en/download/.


## Concept
| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 | Maze Ball
|    | Name                  | Matthias Roming
|    | Matrikelnummer        | 260614
|  1 | Nutzerinteraktion     | Der Nutzer kann im Startmenu das Spiel starten oder zu den Highscores navigieren. Im Spiel kann er eine Plattform kontrollieren und diese ??ber die Bewegung der Maus kippen und ??ber das Mausrad drehen. Mit Escape kann ein Menu im Spiel ge??ffnet werden, um zum Startmenu oder zu den Highscores zu navigieren zu k??nnen. Wurde das Spiel abgeschlossen, wird der Benutzer aufgefordert einen Namen anzugeben, um die Zeit unter diesem Namen in den Highscores zu speichern. |
|  2 | Objektinteraktion     | Es gibt mehrere Plattformen, auf denen der Ball rollen kann. Diese Plattformen setzen sich aus B??den, W??nden und Kanonen zusammen, mit denen der Ball kollidieren kann. Die Kanonen k??nnen den Ball mit einem Projektil wegsto??en und somit in den Abgrund bef??rdern. Fliegt der Ball zu tief, wird das Spiel zur??ckgesetzt. |
|  3 | Objektanzahl variabel | Zur Laufzeit des Spiels werden Projektile und andere Knoten zur Steuerung der Plattformen erstellt. |
|  4 | Szenenhierarchie      | <ul><li>Scene<ul><li>Sonne</li><li>Spieler-Steuerobjekt<ul><li>Kameraknoten</li></ul></li><li>Ball</li><li>Plattformen<ul><li>B??den</li><li>W??nde</li><li>Bewegliche W??nde</li><li>Kanonen</li></ul></li><li>Zielplattform</li></ul></li></ul> In diesem Szenenbaum stehen Plattformen, B??den, W??nde, Bewegliche W??nde und Kanonen f??r mehrere Knoten, die den gleichen Namen tragen z.B. steht Plattformen f??r mehrere Knoten mit dem Namen "Plattform". Das Spieler-Steuerobjekt, und somit auch die Kamera, soll in einer flie??enden Bewegung dem Ball folgen. |
|  5 | Sound                 | Soundeffekte bei: <ul><li>Kollisionen des Balls</li><li>Kontrollwechsel der Plattform</li><li>Sturz in den Abgrund</li><li>Erreichen des Ziels</li></ul> |
|  6 | GUI                   | Als grafisches Interface gibt es ein Startmenu und ein Menu im Spiel als auch eine Zeitanzeige. Nach Abschlie??en des Spiels soll ein Dialog mit der Nachricht ???Finished!??? der ben??tigten Zeit und ein Eingabefeld f??r den Namen erscheinen. |
|  7 | Externe Daten         | Eine Bestenliste soll gespeichert werden und verschiedene Gamesettings sollen konfigurierbarsein. |
|  8 | Komponenten           | Es sollen folgende Komponenten entwickelt werden, um sie an entsprechende Knoten in der Scene anzuh??ngen: <ul><li>Ballkomponente</li><li>Plattformkomponente</li><li>Bewegungskomponente</li><li>Kanonenkomponente</li></ul> Die Ballkomponente steuert die Soundeffekte des Balls und das Zur??cksetzen bei einem Absturz. Die Plattformkomponente kn??pft Rigidbodies an seine Kindknoten an und reagiert auf deren Kollisionen, um einen Kontrollwechsel auszul??sen. Die Bewegungskomponente soll es erm??glichen einen Knoten mit einer bestimmten Geschwindigkeit eine bestimmte Strecke bewegen zu lassen. Diese Bewegung kann in einer Bumerang-Schleife ausgef??hrt werden. Die Kanonenkomponente soll ein Projektil vor seinem Knoten abfeuern, wenn der Ball in die Schussbahn innerhalb einer bestimmten Reichweite rollt. |
|  9 | Verhaltensklassen     | Es sollen folgende Klassen implementiert werden: <ul><li>Game</li><li>Spielersteuerung</li><li>Projektil</li><li>Turntable</li></ul> Die Game-Klasse steuert die Spielzust??nde und bietet Methoden an, um das Spiel zu starten, zur??ckzusetzen und zu beenden. Des Weiteren soll sie Nachrichten/Hinweise, Menu und Dialoge und die Stoppuhr steuern. Die Spielersteuerungs-Klasse steuert die Kamera und die Plattformen bzw. nur die eine kontrollierte Plattform. Die Projektil-Klasse dient dazu fertige und abfeuerbare Projektile erzeugen zu k??nnen. Die Turntable-Klasse soll ??ber eine Knotenstruktur drei Achsen beschreiben und Methoden zur Verf??gung stellen, um Kindknoten anh??ngen und die Achsen rotieren zu k??nnen. |
| 10 | Ma??e & Positionen     | In Maze Ball soll der Durchmesser des zu bewegenden Balls 1 sein und dessen Startposition 0. |
| 11 | Event-System          | Au??er dem ???Loop Frame???-Event soll auf Kollisionsevents reagiert werden und somit die entsprechenden Soundeffekte abgespielt werden, die Kontrolle der Plattform gewechselt werden oder das Spielende erreicht werden. F??r die Benutzereingabe muss auch auf entsprechende Events reagiert werden.
