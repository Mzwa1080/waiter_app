

create table weekdays(
id  serial not null primary key,
days  text not null varchar(20) unique
);

create table availability(
id  serial not null primary key,
num_of_days text not null,
foreign key(num_of_days) references weekdays(days)
);

create table employees(
id  serial not null primary key,
weekdays_days_id serial not null unique,
availability_num_of_days_id serial not null unique,
person text not null varchar(30),
foreign key(weekdays_days_id) references weekdays(days_id),
foreign key(availability_num_of_days_id) references availability(num_of_days)
);

insert into weekdays(days) values('Sunday');
insert into weekdays(days) values('Monday');
insert into weekdays(days) values('Tuesday');
insert into weekdays(days) values('Wednesday');
insert into weekdays(days) values('Thursday');
insert into weekdays(days) values('Friday');
insert into weekdays(days) values('Saturday');
