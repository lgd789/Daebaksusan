package com.seafood.back.service.imple;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.seafood.back.dto.CartDTO;
import com.seafood.back.dto.PaymentItemDTO;
import com.seafood.back.dto.ProductDTO;
import com.seafood.back.entity.CategoryEntity;
import com.seafood.back.entity.OptionEntity;
import com.seafood.back.entity.ProductDealsEntity;
import com.seafood.back.entity.ProductDetail;
import com.seafood.back.entity.ProductEntity;
import com.seafood.back.entity.PromotionalProductEntity;
import com.seafood.back.entity.PromotionalVideoEntity;
import com.seafood.back.respository.CategoryRepository;
import com.seafood.back.respository.OptionRepository;
import com.seafood.back.respository.ProductDealsRepository;
import com.seafood.back.respository.ProductDetailRepository;
import com.seafood.back.respository.ProductRepository;
import com.seafood.back.respository.PromotionalProductRepository;
import com.seafood.back.service.ProductService;
import com.seafood.back.service.S3Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImple implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImple.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OptionRepository optionRepository;
    private final ProductDealsRepository productDealsRepository;
    private final ProductDetailRepository productDetailRepository;
    private final PromotionalProductRepository promotionalProductRepository;

    @Override
    public List<ProductDTO> findProductAll() {
        // 모든 상품 조회
        List<ProductEntity> products = productRepository.findAll();

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> findProductBest() {
        List<ProductEntity> products = productRepository.findByPopularity(true);

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> findProductNew() {
        List<ProductEntity> products = productRepository.findTop10ByOrderByProductIdDesc();

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> findProductRecommend() {
        List<ProductEntity> products = productRepository.findByRecommended(true);

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<OptionEntity> findOption(Long productId) {
        List<OptionEntity> options = new ArrayList<>();
        optionRepository.findByProductId(productId).forEach(e -> options.add(e));
        return options;
    }

    @Override
    public List<ProductDTO> getProductsByCategoryAndSubcategories(Long categoryId) {
        List<ProductEntity> products = new ArrayList<>();

        Optional<CategoryEntity> categoryOptional = categoryRepository.findById(categoryId);
        if (categoryOptional.isPresent()) {
            CategoryEntity category = categoryOptional.get();

            // 상위 카테고리의 하위 카테고리들 조회
            List<CategoryEntity> subcategories = category.getSubcategories();
            if (subcategories.isEmpty()) {
                // 하위 카테고리가 없으면 상위 카테고리의 제품들을 가져옴
                products.addAll(category.getProducts());
            } else {
                // 하위 카테고리들에 속한 제품들을 모두 가져옴
                for (CategoryEntity subcategory : subcategories) {
                    products.addAll(subcategory.getProducts());
                }
            }

        }

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> getProductsByCategorySub(Long categoryId) {
        // 카테고리에 따른 제품 데이터를 데이터베이스에서 조회하여 반환
        List<ProductEntity> products = productRepository.findByCategory(categoryId);
        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> searchProducts(String query) {
        List<ProductEntity> products = productRepository.findByNameContaining(query);

        // 생선이라는 카테고리검색 -> category.name에서 생선을 찾음 -> 만약 parentId가 null이면 상위 카테고리 ->
        // getProductsByCategoryAndSubcategories() 호출
        // 만약 parentId가 있다면 하위 카테고리 -> getProductsByCategorySub() 호출
        // products 뒤에 add시킴

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        if (productDTOs.isEmpty()) {
            CategoryEntity category = categoryRepository.findByName(query);

            if (category != null) {
                if (category.getParentCategory() != null) {
                    productDTOs.addAll(getProductsByCategorySub(category.getCategoryId()));
                } else {

                    productDTOs.addAll(getProductsByCategoryAndSubcategories(category.getCategoryId()));
                }
            }
        }

        return productDTOs;
    }

    @Override
    public ProductEntity getProductById(Long productId) {

        return productRepository.findByProductId(productId);
    }

    @Override
    public OptionEntity getOptionById(Long optionId) {

        return optionRepository.findByOptionId(optionId);
    }

    @Override
    @Transactional
    public void updateProductQuantities(List<CartDTO> orderItems) {
        for (CartDTO orderItem : orderItems) {
            Long productId = orderItem.getCartItem().getProduct().getProductId();
            int orderedQuantity = orderItem.getCartItem().getQuantity();

            // 상품을 데이터베이스에서 조회하여 수량을 변경합니다.
            Optional<ProductEntity> productOptional = productRepository.findById(productId);
            if (productOptional.isPresent()) {
                ProductEntity product = productOptional.get();
                int currentStock = product.getStockQuantity();
                if (currentStock >= orderedQuantity) {
                    product.setStockQuantity(currentStock - orderedQuantity);
                    // 변경된 상품 정보를 데이터베이스에 저장합니다.
                    productRepository.save(product);
                } else {

                    throw new RuntimeException("주문된 수량이 재고보다 많습니다.");
                }
            } else {
                // 상품을 찾을 수 없는 경우의 예외 처리를 수행합니다.
                throw new RuntimeException("상품을 찾을 수 없습니다.");
            }
        }
    }

    @Override
    public List<ProductDealsEntity> findProductDeal() {
        // 현재 시간
        Date now = new Date();

        // 현재 시간에 해당하는 타임 특가가 적용되는 상품들 조회
        List<ProductDealsEntity> productDeals = productDealsRepository.findByStartDateBeforeAndEndDateAfter(now, now);

        return productDeals;
    }

    @Override
    public ProductDTO convertToProductDTO(ProductEntity product, List<ProductDealsEntity> dealProducts) {
        // try {
        ProductDTO productDTO = new ProductDTO();
        // ProductEntity의 필드 값을 ProductDTO로 복사
        productDTO.setProductId(product.getProductId());
        productDTO.setCategory(product.getCategory());
        productDTO.setName(product.getName());
        productDTO.setImageUrl(product.getImageUrl());
        productDTO.setStockQuantity(product.getStockQuantity());
        productDTO.setRegularPrice(product.getRegularPrice());
        productDTO.setSalePrice(product.getSalePrice());
        productDTO.setShippingCost(product.getShippingCost());
        productDTO.setDescription(product.getDescription());
        productDTO.setArrivalDate(product.getArrivalDate());
        productDTO.setRecommended(product.getRecommended());
        productDTO.setPopularity(product.getPopularity());
        productDTO.setMaxQuantityPerDelivery(product.getMaxQuantityPerDelivery());

        // String imageUrl = s3Service.getImageUrl(product.getImageUrl());
        // productDTO.setImageUrl(imageUrl);
        productDTO.setImageUrl(product.getImageUrl());

        // 타임 특가가 적용된 경우에만 sale_price 변경
        for (ProductDealsEntity dealProduct : dealProducts) {
            if (product.getProductId().equals(dealProduct.getProductId())) {
                productDTO.setSalePrice(productDTO.getSalePrice().add(dealProduct.getDealPrice()));
                productDTO.setStartDate(dealProduct.getStartDate());
                productDTO.setEndDate(dealProduct.getEndDate());
                break;
            }
        }

        return productDTO;
        // } catch (IOException e) {
        // e.printStackTrace();
        // return null;
        // }
    }

    @Override
    public List<ProductDTO> convertProductEntitiesToDTOs(List<ProductEntity> products) {

        // 결과를 저장할 리스트
        List<ProductDTO> productDTOs = new ArrayList<>();
        List<ProductDealsEntity> productDeals = findProductDeal();

        // 상품을 DTO로 변환하여 리스트에 추가
        for (ProductEntity product : products) {
            ProductDTO productDTO = convertToProductDTO(product, productDeals);

            productDTOs.add(productDTO);
        }

        return productDTOs;
    }

    @Override
    public List<ProductDTO> getTimeDealProducts() {
        List<ProductDealsEntity> productDeals = findProductDeal();

        List<Long> productIds = productDeals.stream()
                .map(ProductDealsEntity::getProductId)
                .collect(Collectors.toList());

        // productId들로 해당 상품들을 조회합니다.
        List<ProductEntity> products = productRepository.findAllByProductIdIn(productIds);
        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);
        return productDTOs;

    }

    @Override
    @Transactional
    public void addProductQuantities(String orderNumber, List<PaymentItemDTO> orderItems) {
        for (PaymentItemDTO orderItem : orderItems) {
            Long productId = orderItem.getCartItem().getProduct().getProductId();
            Optional<ProductEntity> productOptional = productRepository.findById(productId);
            if (productOptional.isPresent()) {
                ProductEntity product = productOptional.get();
                int currentStock = product.getStockQuantity();
                int orderedQuantity = orderItem.getCartItem().getQuantity();
                product.setStockQuantity(currentStock + orderedQuantity);

                productRepository.save(product);

                // 주문 항목의 총 금액 계산
                int quantity = orderItem.getCartItem().getQuantity();

                BigDecimal regularPrice = orderItem.getCartItem().getProduct().getRegularPrice();
                BigDecimal salePrice = orderItem.getCartItem().getProduct().getSalePrice();
                BigDecimal optionPrice = orderItem.getCartItem().getOption().getAddPrice();
                BigDecimal shippingCost = orderItem.getCartItem().getProduct().getShippingCost();

                BigDecimal pricePerUnit = regularPrice.subtract(salePrice);
                BigDecimal totalPricePerUnit = pricePerUnit.add(optionPrice);
                BigDecimal totalAmount = totalPricePerUnit.multiply(BigDecimal.valueOf(quantity));

                int boxCnt = orderItem.getCartItem().getBoxCnt();
            
                BigDecimal optionTotalPrice = optionPrice.multiply(BigDecimal.valueOf(boxCnt));
                BigDecimal shippingTotalCost = shippingCost.multiply(BigDecimal.valueOf(boxCnt));

                totalAmount = totalAmount.add(optionTotalPrice).add(shippingTotalCost);
                
                logger.info("Cancel Item - Message: {}, OrderNumber: {}, ProductId: {}, ProductName: {}, Quantity: {}, Amount: {}",
                            "취소 항목 처리",
                            orderNumber,
                            orderItem.getCartItem().getProduct().getProductId(),
                            orderItem.getCartItem().getProduct().getName(),
                            quantity,
                            totalAmount );
            } else {
                // 상품을 찾을 수 없는 경우의 예외 처리를 수행합니다.
                throw new RuntimeException("상품을 찾을 수 없습니다.");
            }
        }
    }

    @Override
    public String getProductInfoImage(Long productId) throws IOException {
        // 상품 상세정보를 조회
        ProductDetail productDetail = productDetailRepository.findByProductId(productId);

        if (productDetail == null) {
            return null;
        }

        // String imageUrl = s3Service.getImageUrl(productDetail.getImageUrl());
        String imageUrl = productDetail.getImageUrl();

        // 조회된 상품 상세정보가 있으면 S3 URL 반환, 없으면 null 반환
        return imageUrl;
    }

    @Override
    public ProductDTO findProduct(Long productId) {
        ProductEntity productEntity = productRepository.findByProductId(productId);
        if (productEntity == null) {
            logger.error("Product - Message: {}, Product Id: {}",
                    "존재하지 않는 상품",
                    productId);

            throw new IllegalArgumentException("Product not found with id: " + productId);
        }
        List<ProductDealsEntity> productDeals = findProductDeal();

        ProductDTO productDTO = convertToProductDTO(productEntity, productDeals);

        logger.info("Product - Message: {}, Product Id: {}, Product Name: {}",
                    "상품 클릭",
                    productDTO.getProductId(),
                    productDTO.getName());
        return productDTO;
    }

    @Override
    public List<ProductDTO> getProductsByCategoryAndSubcategories(String categoryName) {
        List<ProductEntity> products = new ArrayList<>();

        CategoryEntity categoryEntity = categoryRepository.findByName(categoryName);
        if (categoryEntity == null) {
            throw new IllegalArgumentException("Category with name " + categoryName + " not found");
        }

        List<CategoryEntity> subcategories = categoryEntity.getSubcategories();
        if (subcategories.isEmpty()) {
            // 하위 카테고리가 없으면 상위 카테고리의 제품들을 가져옴
            products.addAll(categoryEntity.getProducts());
        } else {
            // 하위 카테고리들에 속한 제품들을 모두 가져옴
            for (CategoryEntity subcategory : subcategories) {
                products.addAll(subcategory.getProducts());
            }
        }

        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;

    }

    @Override
    public List<ProductDTO> getProductsByCategorySub(String categoryName) {
        CategoryEntity categoryEntity = categoryRepository.findByName(categoryName);
        if (categoryEntity == null) {
            throw new IllegalArgumentException("Category with name " + categoryName + " not found");
        }

        List<ProductEntity> products = productRepository.findByCategory(categoryEntity.getCategoryId());
        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(products);

        return productDTOs;
    }

    @Override
    public List<ProductDTO> getPromotionalProducts(PromotionalVideoEntity video) {

        List<PromotionalProductEntity> promotionalProducts = promotionalProductRepository.findByVideo(video);

        // PromotionalProductEntity 리스트를 ProductEntity 리스트로 변환
        List<ProductEntity> productEntities = promotionalProducts.stream()
                .map(PromotionalProductEntity::getProduct)
                .collect(Collectors.toList());

        // ProductEntity 리스트를 ProductDTO 리스트로 변환
        List<ProductDTO> productDTOs = convertProductEntitiesToDTOs(productEntities);

        return productDTOs;
    }

}
