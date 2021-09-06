CREATE TABLE IF NOT EXISTS TimeChargeClients(
    ID bigint(20) auto_increment NOT NULL,
    UserID bigint(20) NOT NULL,
    Name VARCHAR(60),
    Code VARCHAR(2),
    Email VARCHAR(128),
    ContactNumber VARCHAR(32),
    Address VARCHAR(255),
    BankDetails VARCHAR(255),
    HourlyRate DOUBLE(5, 2),
    Currency VARCHAR(8),
    PRIMARY KEY(ID)
)

INSERT INTO TimeChargeClients(
    UserID,
    Name,
    Code
)
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



CREATE OR REPLACE VIEW TimeChargeView as
    SELECT
        c.ID as ChargeID,
        c.UserID as UserID,
        c.ProjectID as ProjectID,
        TimeTo,
        TimeFrom,
        round(TIMESTAMPDIFF(SECOND, TimeFrom, TimeTo)/3600, 2) as Hours,
        Status,
        p.Name as Project,
        s.Name as Client,
        s.HourlyRate as Rate,
        Convert(round(TIMESTAMPDIFF(SECOND, TimeFrom, TimeTo)/3600, 2) * s.HourlyRate, DECIMAL(10,2)) as Bill,
        s.Currency as Currency 
    FROM
        TimeCharges c
    INNER JOIN
        TimeChargeProjects p
    ON c.ProjectID = p.ID
    INNER JOIN
        TimeChargeClients s
    ON p.ClientID = s.ID
    ORDER BY TimeFrom ASC;
Select * from TimeChargeMonthlyView;


CREATE OR REPLACE VIEW TimeChargeMonthlyView as
    SELECT
        YEAR(TimeTo) as Year,
        MONTH(TimeTo) as Month,
        Client,
        Curren
        format(sum(Hours),2) as Hours,
        format(sum(Hours)/8,2) as Days,
        format(round(sum(Bill),0),0) as Bill
    FROM
        TimeChargeView
    WHERE
        Hours IS NOT NULL
    GROUP BY
        Year,
        Month,
        Client,
        Currency


CREATE OR REPLACE VIEW TimeChargeProjectMonthlyView as
    SELECT
        Client,
        YEAR(TimeTo) as Year,
        MONTH(TimeTo) as Month,
        Project,
        Currency,
        format(sum(Hours),2) as Hours,
        format(sum(Hours)/8,2) as Days,
        format(round(sum(Bill),0),0) as Bill
    FROM
        TimeChargeView
    WHERE
        Hours IS NOT NULL
    GROUP BY
        Client,
        Year,
        Month,
        Project,
        Currency
    ORDER BY 
        Client ASC,
        YEAR ASC,
        MONTH ASC,
        Project ASC;



select * from TimeChargeProjectMonthlyView;




        

