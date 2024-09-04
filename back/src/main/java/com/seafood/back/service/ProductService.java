package com.seafood.back.service;

import java.io.IOException;
import java.util.List;

import com.seafood.back.dto.CartDTO;
import com.seafood.back.dto.PaymentItemDTO;
import com.seafood.back.dto.ProductDTO;
import com.seafood.back.entity.OptionEntity;
import com.seafood.back.entity.ProductDealsEntity;
import com.seafood.back.entity.ProductEntity;
import com.seafood.back.entity.PromotionalVideoEntity;

public interface ProductService {
    public List<ProductDTO> findProductAll();
    public List<ProductDTO> findProductBest();
    public List<ProductDTO> findProductNew();
    public List<OptionEntity> findOption(Long productId);
    public List<ProductDTO> getProductsByCategoryAndSubcategories(Long categoryId);
    public List<ProductDTO> getProductsByCategorySub(Long categoryId);
    public List<ProductDTO> searchProducts(String query);
    public ProductEntity getProductById(Long productId);
    public OptionEntity getOptionById(Long optionId);
    public void updateProductQuantities(List<CartDTO> orderItems);
    public List<ProductDealsEntity> findProductDeal();
    public ProductDTO convertToProductDTO(ProductEntity product, List<ProductDealsEntity> dealProducts);
    public List<ProductDTO> convertProductEntitiesToDTOs(List<ProductEntity> products);
    public List<ProductDTO> getTimeDealProducts();
    public List<ProductDTO> findProductRecommend();
    public void addProductQuantities(String orderNumber, List<PaymentItemDTO> orderItems);
    public String getProductInfoImage(Long productId) throws IOException;
    public ProductDTO findProduct(Long productId);
    public List<ProductDTO> getProductsByCategoryAndSubcategories(String categoryName);
    public List<ProductDTO> getProductsByCategorySub(String categoryName);
    public List<ProductDTO> getPromotionalProducts(PromotionalVideoEntity video);
}
