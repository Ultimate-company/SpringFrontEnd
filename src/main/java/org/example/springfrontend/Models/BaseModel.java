package org.example.springfrontend.Models;

import java.util.List;

public class BaseModel<T> {
    private List<T> data;
    private int totalDataCount;
    private boolean includeDeleted;
}