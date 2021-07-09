CREATE TABLE IF NOT EXISTS TimeChargeClients(
    ID bigint(20) auto_increment NOT NULL,
    UserID bigint(20) NOT NULL,
    Name VARCHAR(60),
    Code VARCHAR(2),
    Email VARCHAR(128),
    ContactNumber VARCHAR(32),
    Address VARCHAR(255),
    BankDetails VARCHAR(255),
    PRIMARY KEY(ID)
);

INSERT INTO TimeChargeClients(
    UserID,
    Name,
    Code
g)
VALUES
    (1,"OnlineDistributeur", "OD"),
    (1,"HealthPath", "HP"),
    (1,"Friend", "FD");

CREATE TABLE IF NOT EXISTS TimeChargeProjects(
    ID bigint(20) auto_increment NOT NULL,
    UserID bigint(20) NOT NULL,
    Name VARCHAR(60),
    Address VARCHAR(255),
    ClientID bigint(20) NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (ClientID) REFERENCES TimeChargeClients(ID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

INSERT INTO TimeChargeProjects(
    UserID, Name, ClientID
)
VALUES
    (1, "wannah", (SELECT ID FROM TimeChargeClients WHERE Name = 'OnlineDistributeur')),
    (1, "fleur", (SELECT ID FROM TimeChargeClients WHERE Name = 'OnlineDistributeur')),
    (1, "bedshop", (SELECT ID FROM TimeChargeClients WHERE Name = 'OnlineDistributeur')),
    (1, "kering", (SELECT ID FROM TimeChargeClients WHERE Name = 'OnlineDistributeur')),
    (1, "stooltest", (SELECT ID FROM TimeChargeClients WHERE Name = 'HealthPath')),
    (1, "orders_automation", (SELECT ID FROM TimeChargeClients WHERE Name = 'HealthPath')),
    (1, "sibo", (SELECT ID FROM TimeChargeClients WHERE Name = 'HealthPath'));

CREATE TABLE IF NOT EXISTS TimeCharges(
    ID bigint(20) auto_increment NOT NULL,
    UserID bigint(20) NOT NULL,
    TimeFrom datetime,
    TimeTo datetime,
    Note VARCHAR(128),
    Percentage DOUBLE(5, 4) DEFAULT 1.0000,
    Status VARCHAR(10),
    ProjectID bigint(20),
    PRIMARY KEY(ID),
    FOREIGN KEY(ProjectID) 
        REFERENCES TimeChargeProjects(ID)
        ON DELETE SET NULL
        ON UPDATE CASCADE   
);

INSERT INTO TimeCharges(
    UserID,
    TimeFrom,
    TimeTo,
    Note,
    Percentage,
    Status,
    ProjectID
)
VALUES
    (1, "2021-07-01 12:00:00", "2021-07-01 13:00:00", "some note", 1.0000, "CLOSED", 2);


INSERT INTO TimeCharges(
    UserID,
    TimeFrom,
    Status,
    ProjectID
)
VALUES
    (1, "2021-07-03 12:00:00", "OPEN", 2);

UPDATE TimeCharges
SET 
    TimeTo = "2021-07-03 13:00:00", 
    Status = "CLOSED", 
    NOTE = "some note added on this job"
WHERE ID = 2;


INSERT INTO TimeCharges(
    UserID,
    TimeFrom,
    Status,
    ProjectID
)
VALUES
    (1, "2021-07-04 12:00:00", "OPEN", 2);

