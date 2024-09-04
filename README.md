<div align="center">
<h2>대박수산</h2>
</div>

## 목차
  - [개요](#개요) 
  - [프로젝트 구현 결과](#프로젝트-구현-결과)
  - [설계 내용](#설계-내용)
  - [문제점](#문제점)
<br><br>

## 개요
- 프로젝트 이름: 대박수산(수산물 쇼핑몰)
- 프로젝트 기간: 2024.03 ~ 2023.06
- 개발 엔진 및 언어: 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)

<br><br>
## 프로젝트 구현 결과


- 대박수산 https://daebaksusan.shop/

- 시스템 아키텍처
  ![시스템 아키텍처](https://github.com/jh990714/Daebaksusan/assets/144774186/77ef3271-ed49-473c-896b-305efdb326d2)

- ERD
  ![daebaksusan_ERD](https://github.com/jh990714/Daebaksusan/assets/144774186/12e768f3-af94-4b6b-99c5-d4042fff8d10)
  

<br><br>

## 설계 내용
  ### 로그인
  
  1. **회원 유효성 검사**
      - 입력된 **아이디**와 **비밀번호**가 DB에 저장되어있는지 확인
  
  1. **JWT 토큰 발행**
      - **Claims 설정:**
          
          ```java
          public static String createJwt(Long id, String secretKey, Long expiredMs) {
                Claims claims = Jwts.claims();
                claims.put("ID", id);
          
                return Jwts.builder()
                        .setClaims(claims)
                        .setIssuedAt(new Date(System.currentTimeMillis()))
                        .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                        .signWith(SignatureAlgorithm.HS256, secretKey)
                        .compact();
            }
          ```
          
          - 사용자 ID 정보를 토큰에 저장
          
  2. **토큰 저장**
      - 발행된 **access Token**과 **refresh Token**을 클라이언트에 반환
      - **로컬스토리지**에 토큰값 저장
      
  3. **로그인 확인**
      - 클라이언트는 **access Token**을 사용하여 로그인 상태를 서버에 인증하고, 로그인 상태를 유지.
      - 로그인 상태를 유지하기 위해 클라이언트는 **access Token**과 **refresh Token**을 통해, 만료되었을 경우 토큰 재발급.
      
  4. **토큰 재발행**
      - **api 요청**
          - 인증이 필요한 api 요청을 보낼 때 access Token을 헤더에 포함시켜 보냄.
      - **access Token 만료확인**
          - 서버에서 **access Token** 유효성을 검사
          - **만료된 토큰**일 경우 **에러 응답**을 클라이언트에 반환
      - **토큰 재발행**
          - **refresh Token**을 서버에 전송.
          - 서버는 **refresh Token**의 유효성을 검사.
          - **유효한 refresh Token**일 경우 새로운 **access Token** 발행
          - **새로운 access Token**을 클라이언트에 반환하고, 로컬스토리지에 저장
      - **요청 재시도**
          - 새로운 **access Token**과 함께 동일한 요청을 **재시도**.
  
  ### 장바구니
  1. **회원 및 비회원 구분**
      - **회원일 경우**: 사용자 정보를 기반으로 **DB**에서 관리되는 장바구니를 사용.
      - **비회원일 경우**: 클라이언트 측에서 **쿠키**로 관리되는 장바구니를 사용.
      - **비회원에서 로그인 시**: 비회원으로 사용할 때 쿠키에 저장된 장바구니 목록들이 회원의 장바구니에 추가됨.
      
  2. **장바구니 추가**
      - **회원일 경우**:
          - API를 통해 사용자의 장바구니에 상품을 추가.
          - 기존에 같은 상품과 옵션이 장바구니에 있는지 여부를 확인.
          - 기존에 존재하는 상품이라면, 해당 상품의 수량을 증가.
          - 새로운 상품이라면, 장바구니에 새로 추가.
          - 최대 수량을 초과하면 에러를 반환하여 사용자에게 알림.
      - **비회원일 경우**:
          - 클라이언트 측 쿠키에 상품 정보를 저장.
          - 최대 수량을 초과하면 사용자에게 알림.
          
  3. **상품 수량 및 재고 확인**
      - 장바구니에 상품을 추가할 때는 해당 상품의 최대 수량을 확인.
      - 장바구니에 담겨 있는 상품의 수량이나 상태를 변경할 때도 재고 수량을 체크.
      
  4. **장바구니 목록 조회 및 수정**
      - 사용자가 장바구니 페이지에서 현재 담긴 상품 목록을 조회하고, 수량을 수정하거나 삭제할 수 있도록 함.
  
  ### 결제
  
  **Iamport**를 사용하여 **결제 시스템**을 구현.
  
  **Iamport(PortOne) 선정 이유: Iamport**는 다양한 결제 수단을 **통합적으로 지원**하며, 결제의 안정성과 편의성을 제공, 또한 **무료**로 이용할 수 있어 경제적인 이점이 있다.
  
  1. **상품 및 결제 정보 확인**
      - 사용자는 결제할 상품의 수량을 선택하고, **쿠폰을 적용하거나 포인트를 사용할 수 있다.**
      - 결제할 **총 금액을 확인**하고, 이를 기반으로 결제 **유효성 검사**를 시작한다.
      - 유효성 검사에서 **오류가 발생**할 경우 **결제가 취소**됨.
      
  2. **결제 금액 유효성 검사**
      - **상품 가격 계산:**  결제한 상품의 가격과 수량을 기반으로 DB에 저장된 상품의 총 가격을 계산.
      - **쿠폰 유효성 확인:** 사용된 쿠폰이 유효한지, 만료되지 않았는지, 사용 가능한 상태인지 확인.
      - **포인트 유효성 확인:** 사용된 포인트가 사용자의 **잔여 포인트 내**에서 사용되었는지 확인.
      - **총 결제 금액 확인:** 계산된 상품 총액, 쿠폰 할인 금액, 포인트 사용 금액을 모두 반영한 최종 결제 금액이 결제 요청에서 제공된 총 결제 금액과 일치하는지 확인.
  3. **상품 수량 유효성 검사**
      - **재고 수량 비교:** 주문 요청 수량이 재고 수량을 초과하지 않는지 확인.
      
  4. **결제 완료**
      - 결제가 완료되면, 사용자에게 결제 완료 메시지를 표시.
      - 주문 번호와 함께 결제 정보를 사용자에게 제공.
  
  ### AWS **EC2** 배포 및 SSL 인증서 설정
  
  1. **AWS EC2에서 Ubuntu를 통한 Nginx 배포**
      - **환경 설정:** AWS EC2 인스턴스에서 Ubuntu를 사용하여 Nginx를 설정.
      
  2. **SSL 인증서 발급 및 설정**
      - **SSL 인증서 발급:**  **Let's Encrypt**를 사용하여 도메인에 대해 SSL 인증서를 발급.
      `certbot` 명령어를 사용.
      - **Nginx 설정 파일:**
          
          ```nginx
          server {
              listen 80;
              listen [::]:80;
              server_name daebaksusan.shop www.daebaksusan.shop;
              location / {
                  rewrite ^ https://$host$request_uri? permanent;
              }
          }
          
          server {
              listen 443 ssl;
              listen [::]:443 ssl;
              server_name daebaksusan.shop www.daebaksusan.shop;
              
              ssl_certificate /etc/letsencrypt/live/daebaksusan.shop-0001/fullchain.pem; # managed by Certbot
              ssl_certificate_key /etc/letsencrypt/live/daebaksusan.shop-0001/privkey.pem; # managed by Certbot
              include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
              ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
              
              location /api {
                  proxy_pass http://localhost:8080;
                  proxy_redirect off;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection 'upgrade';
                  proxy_set_header Host $host;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $scheme;
                  proxy_cache_bypass $http_upgrade;
                  proxy_buffering on;
                  proxy_buffers 4 256k;
                  proxy_busy_buffers_size 256k;
              }
              
              location / {
                  root /home/ubuntu/build;
                  index index.html index.htm;
                  try_files $uri /index.html;
              }
          }
          ```
          
          - HTTP 포트(80)와 HTTPS 포트(443)에서 서버가 수신 대기하도록 설정.
          - HTTP 요청을 HTTPS로 리디렉션.
          - SSL 인증서와 키 파일을 Nginx에 설정하여 HTTPS를 통한 통신.
          - `/api` 경로로 들어오는 요청을 백엔드(http://localhost:8080)로 프록시.

## 문제점

### 데이터 로딩 시간

1. **페이지네이션을 이용한 성능 개선**
    - **문제점:** 데이터베이스에서 모든 결과를 한 번에 가져와야 했기 때문에, 사용자가 페이지를 로딩하는 데 많은 시간이 소요되었다.
    - **해결 방안:**  **페이지네이션을 적용**하여 각 페이지마다 필요한 데이터만 가져와서 로딩 시간이 현저히 줄어들었다.
        
        특히 **Iamport API를 통해 결제 세부 정보를 가져오는 과정**에서, 모든 데이터를 한 번에 가져오면 성능 저하가 발생하는 문제가 있었다. **페이지네이션을 도입하여 1페이지당 `size`개씩의 데이터만 가져오도록** 변경하였다.
        
2. **N+1 문제 해결**
    - **문제점:**  `CategoryEntity`와 그에 속한 `Subcategory`들을 모두 조회할 때, 처음 쿼리로 `CategoryEntity`를 가져온 후, 각 `CategoryEntity`마다 추가적인 쿼리가 실행되어 각각의 `Subcategory`를 가져오는 문제가 있었다. 이로 인해 데이터 로딩 속도가 느려졌다.
    - **해결 방안:** `Repository`의 쿼리에 직접적으로 **`LEFT JOIN FETCH`** **구문을 추가**해서 한 번의 쿼리로 모든 `CategoryEntity`와 그에 속한 모든 `Subcategory`를 함께 로드할 수 있게 되었다. 이로 인해 n+1 쿼리 문제가 해결되었고, 데이터베이스 호출 횟수 줄이며 데이터 로딩 시간을 개선했다.

### S3**이미지 요금**

1. **CloudFront 사용**
    - **문제점:** 현재 S3를 사용하여 이미지를 저장하고 제공한다. 하지만 사용자가 동일한 페이지나 다른 페이지에서 반복적으로 **동일한 이미지를 로드할 경우,** S3의 데이터 전송 요금이 누적되어 **상대적으로 높은 비용이 발생**할 수 있다.
    - **해결 방안:** AWS의 **CloudFront**를 도입하여 사용자가 동일한 이미지를 반복 요청할 때마다 **CloudFront 서버에서 이미지를 제공함**으로써 S3에서 직접 데이터를 가져오는 것보다 **데이터 전송 요금을 절감**할 수 있게 된다.
