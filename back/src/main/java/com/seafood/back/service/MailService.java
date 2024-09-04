package com.seafood.back.service;

public interface MailService {
    public void sendMail(String email, String message, boolean isHtml);
}
