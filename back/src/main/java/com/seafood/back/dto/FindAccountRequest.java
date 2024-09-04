package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FindAccountRequest {
    private String name;
    private String email;
    private String Id;
}
