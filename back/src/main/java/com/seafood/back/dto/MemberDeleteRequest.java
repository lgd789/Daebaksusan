package com.seafood.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemberDeleteRequest {
    String password;
    String token;
}
