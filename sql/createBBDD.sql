CREATE TABLE users
(id integer,
email varchar(30),
user_password varchar(30),
PRIMARY KEY (ID));
ALTER TABLE users
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

CREATE TABLE questions
(id integer,
title varchar(30),
tags varchar(30),
text varchar(300),
PRIMARY KEY (ID));
ALTER TABLE questions
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

CREATE TABLE answers (
    Question_id int NOT NULL PRIMARY KEY,
    user_id int NOT NULL,
    text varchar(300),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
ALTER TABLE questions
  ADD `question_like` INT NOT NULL DEFAULT '0' AFTER `Text`;

CREATE TABLE medals (
    user_id int NOT NULL PRIMARY KEY,
    type_medal varchar(300),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users
VALUES ('001', 'xx@gmail.com', '123');
INSERT INTO users
VALUES ('002', 'xx2@gmail.com', '345');
INSERT INTO medals
VALUES ('001', 'Oro');