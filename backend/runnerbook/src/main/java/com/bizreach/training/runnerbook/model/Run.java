package com.bizreach.training.runnerbook.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "runs")
public class Run implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotNull
    @Size(max = 20)
    @Column(name = "title")
    private String title;

    @NotNull
    @Size(max = 20)
    @Column(name = "location")
    private String location;


    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy - HH:mm",timezone =  "Asia/Tokyo")
    private Date creationDateTime;


    @ManyToMany(fetch = FetchType.LAZY,
            cascade =  CascadeType.PERSIST,
            mappedBy = "runs")
    @JsonBackReference
    private Set<User> users = new HashSet<>();

    // Hibernate requires a no-arg constructor
    public Run() {

    }

    public Run(String location, Date creationDateTime) {
        this.location = location;
        this.creationDateTime = creationDateTime;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy - HH:mm",timezone =  "Asia/Tokyo")
    public Date getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Date creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<User> getUsers() {
        return users;
    }

}
