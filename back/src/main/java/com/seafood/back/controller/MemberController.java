package com.seafood.back.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seafood.back.dto.FindAccountRequest;
import com.seafood.back.dto.LoginRequest;
import com.seafood.back.dto.MemberDeleteRequest;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.service.MemberService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {
    
    private final MemberService memberService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            MemberEntity member = memberService.authenticateMember(loginRequest.getId(), loginRequest.getPassword());

            
            if (member == null) {
                new RuntimeException("해당하는 회원이 없습니다.");
            }

            String accessToken = memberService.getAccessToken(member.getMemberId());
            String refreshToken = memberService.getRefreshToken(member.getMemberId());
            TokenResponse tokenResponse = new TokenResponse(accessToken, refreshToken);
        
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    
    @PostMapping("/signUp")
    public ResponseEntity<?> registerMember(@RequestBody MemberEntity member) {
        try {
            MemberEntity registeredMember = memberService.registerNewMember(member);
            return ResponseEntity.ok(registeredMember);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // 또는 다른 적절한 처리
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateMember(Authentication authentication, @RequestBody LoginRequest loginRequest) {
        try {
            log.info(authentication.getName());
            Long memberId = Long.parseLong(authentication.getName());
            MemberEntity member = memberService.authenticateMember(memberId, loginRequest.getPassword());
            
            if (member == null) {
                new RuntimeException("해당하는 회원이 없습니다.");
            }

            return ResponseEntity.ok("true");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdrawMember(Authentication authentication, @RequestBody MemberDeleteRequest request) {
        try {
            Long memberId = Long.parseLong(authentication.getName());

            memberService.withdrawMember(memberId, request.getPassword(), request.getToken());
            
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/findId")
    public ResponseEntity<?> findId(@RequestBody FindAccountRequest request) {
        try {
            System.out.println("request" + request.getEmail() + request.getName());
            String id = memberService.findAccountId(request.getName(), request.getEmail());

            return ResponseEntity.ok().body(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
       
    }

    @PostMapping("/findPassword")
    public ResponseEntity<?> findPassword(@RequestBody FindAccountRequest request) {
        try {
            String message = memberService.findAccountPassword(request.getName(), request.getEmail(), request.getId());
            
            return ResponseEntity.ok().body(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
       
    }
    

}

@Getter
@Setter
class TokenResponse {
    private String accessToken;
    private String refreshToken;

    public TokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}