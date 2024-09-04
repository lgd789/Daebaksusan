package com.seafood.back.service.imple;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.seafood.back.dto.AnswerDTO;
import com.seafood.back.dto.AskQuestionDTO;
import com.seafood.back.dto.QnADTO;
import com.seafood.back.dto.QuestionDTO;
import com.seafood.back.entity.MemberEntity;
import com.seafood.back.entity.QuestionEntity;
import com.seafood.back.respository.MemberRepository;
import com.seafood.back.respository.QuestionRepository;
import com.seafood.back.service.QnAService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnAServiceImple implements QnAService {

    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;

    @Override
    public Page<QnADTO> getQnAByProductId(Long productId, int page, int size) {

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt"); // createdAt 기준으로 내림차순 정렬
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<QuestionEntity> questions = questionRepository.findByProductId(productId, pageable);
        List<QnADTO> qnaDTOs = questions.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
        return new PageImpl<>(qnaDTOs, pageable, questions.getTotalElements());
    }

    private QnADTO convertToDTO(QuestionEntity questionEntity) {
        QnADTO qnaDTO = new QnADTO();

        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setQuestionId(questionEntity.getQuestionId());
        questionDTO.setQuestion(questionEntity.getQuestion());
        questionDTO.setCreatedAt(questionEntity.getCreatedAt());

        String name = questionEntity.getMember().getName();
        if (name.length() >= 3) {
            StringBuilder maskedNameBuilder = new StringBuilder(name);
            for (int i = 1; i < name.length() - 1; i++) {
                maskedNameBuilder.setCharAt(i, '*');
            }
            questionDTO.setName(maskedNameBuilder.toString());
        } else if (name.length() == 2) {
            StringBuilder maskedNameBuilder = new StringBuilder(name);
            maskedNameBuilder.setCharAt(name.length() - 1, '*');
            questionDTO.setName(maskedNameBuilder.toString());
        } else {
            questionDTO.setName(name);
        }

        List<AnswerDTO> answerDTOs = questionEntity.getAnswers().stream()
                .map(answer -> {
                    AnswerDTO answerDTO = new AnswerDTO();
                    answerDTO.setAnswerId(answer.getAnswerId());
                    answerDTO.setContent(answer.getContent());
                    answerDTO.setCreatedAt(answer.getCreatedAt());
                    return answerDTO;
                })
                .collect(Collectors.toList());

        qnaDTO.setQuestion(questionDTO);
        qnaDTO.setAnswers(answerDTOs);

        return qnaDTO;
    }

    @Override
    public void askQuestion(Long memberId, AskQuestionDTO askQuestionDTO) {
        MemberEntity member = memberRepository.findByMemberId(memberId);
        
        if (member == null) {
            throw new IllegalArgumentException("해당 아이디는 존재하지 않습니다.");
        }

        // Create a new question entity
        QuestionEntity question = new QuestionEntity();
        question.setQuestion(askQuestionDTO.getQuestionText());
        question.setProductId(askQuestionDTO.getProductId());
        question.setMember(member); // Set the member who asked the question

        // Save the question entity
        questionRepository.save(question);
    }
}
