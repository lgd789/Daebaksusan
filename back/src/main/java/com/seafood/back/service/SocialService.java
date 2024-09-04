package com.seafood.back.service;

import com.seafood.back.dto.TokenDTO;

public interface SocialService {

    Boolean matchUser(Long memberId, String token);
    
}