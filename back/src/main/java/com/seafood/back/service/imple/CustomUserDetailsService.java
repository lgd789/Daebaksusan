// package com.seafood.back.service.imple;

// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import com.seafood.back.entity.MemberEntity;
// import com.seafood.back.respository.MemberRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class CustomUserDetailsService implements UserDetailsService {

//     private final MemberRepository memberRepository;
//     private final PasswordEncoder passwordEncoder;

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         return memberRepository.findByMemberId(username)
//             .map(this::createUserDetails)
//             .orElseThrow(() -> new UsernameNotFoundException("해당하는 회원을 찾을 수 없습니다."));
//     }

//     // 해당하는 User 의 데이터가 존재한다면 UserDetails 객체로 만들어서 return
//     private UserDetails createUserDetails(MemberEntity member) {
//         return User.builder()
//                 .username(member.getUsername())
//                 .password(member.getPassword()) // 비밀번호를 다시 인코딩하지 않음
//                 .roles(member.getRoles().toArray(new String[0])) // 역할 설정 확인 필요
//                 .build();
//     }
    

// }
