package com.bizreach.training.runnerbook;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


import com.bizreach.training.runnerbook.model.User;
import com.bizreach.training.runnerbook.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;


public class TestUserManager {

    @InjectMocks
    User user;

    @Mock
    UserRepository userRepository;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void getAllUsersTest()
    {
        List<User> list = new ArrayList<User>();
        User userOne = new User("First User", 22, "First Location", "first@email.com", "firstPassword");
        User userTwo    = new User("Second User", 23, "Second Location", "second@email.com", "secondPassword");
        list.add(userOne);
        list.add(userTwo);

        when(userRepository.findAll()).thenReturn(list);

        //test
        List<User> userList = userRepository.findAll();

        assertEquals(2, userList.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    public void getEmployeeByIdTest()
    {
        when(userRepository.getOne((long) 1)).thenReturn(new User("test user", 23, "test Location", "test@email.com", "testPassword"));

        User user = userRepository.getOne((long) 1);

        assertEquals("test user", user.getName());
        assertEquals((Integer) 23, user.getAge());
        assertEquals("test Location", user.getLocation());
        assertEquals("test@email.com", user.getEmail());
    }

    @Test
    public void createEmployeeTest()
    {
        User user =  new User("test user", 23, "test Location", "test@email.com", "testPassword");

        userRepository.save(user);

        verify(userRepository, times(1)).save(user);
    }
}
