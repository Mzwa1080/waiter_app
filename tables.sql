drop table  weekdays,employees, shifts;

create table weekdays(
id  serial not null primary key,
days  text not null
);

create table employees(
  id serial not null primary key,
  name text not null
);

create table shifts(
  id serial not null primary key,
  day_id int not null,
  name_id int not null,
  foreign key(day_id) references weekdays(id),
  foreign key(name_id) references employees(id)
);



insert into weekdays(days) values('Sunday');
insert into weekdays(days) values('Monday');
insert into weekdays(days) values('Tuesday');
insert into weekdays(days) values('Wednesday');
insert into weekdays(days) values('Thursday');
insert into weekdays(days) values('Friday');
insert into weekdays(days) values('Saturday');
