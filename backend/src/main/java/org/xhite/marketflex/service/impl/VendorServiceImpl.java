package org.xhite.marketflex.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.dto.CreateVendorRequest;
import org.xhite.marketflex.dto.ProductDto;
import org.xhite.marketflex.dto.UpdateVendorRequest;
import org.xhite.marketflex.dto.VendorDto;
import org.xhite.marketflex.dto.VendorOrderDto;
import org.xhite.marketflex.exception.ResourceNotFoundException;
import org.xhite.marketflex.exception.BusinessException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.Order;
import org.xhite.marketflex.model.OrderItem;
import org.xhite.marketflex.model.Vendor;
import org.xhite.marketflex.model.enums.Role;
import org.xhite.marketflex.repository.OrderItemRepository;
import org.xhite.marketflex.repository.OrderRepository;
import org.xhite.marketflex.repository.ProductRepository;
import org.xhite.marketflex.repository.VendorRepository;
import org.xhite.marketflex.model.enums.OrderStatus;
import org.xhite.marketflex.service.ProductService;
import org.xhite.marketflex.service.UserService;
import org.xhite.marketflex.service.VendorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public VendorDto getVendorByStoreName(String storeName) {
        Vendor vendor = vendorRepository.findByStoreNameIgnoreCase(storeName)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with store name: " + storeName));
        return convertToDto(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorDto> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorOrderDto> getVendorOrders(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + vendorId));
        
        // Check ownership
        if (!vendor.getUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BusinessException("You don't have permission to view this vendor's orders");
        }
        
        // Fetch order items for this vendor
        List<OrderItem> orderItems = orderItemRepository.findByVendorIdOrderByCreatedAtDesc(vendorId);
        
        // Group by order
        Map<Order, List<OrderItem>> orderItemsMap = orderItems.stream()
                .collect(Collectors.groupingBy(OrderItem::getOrder));
        
        return orderItemsMap.entrySet().stream()
                .map(entry -> {
                    Order order = entry.getKey();
                    List<OrderItem> items = entry.getValue();
                    BigDecimal vendorTotal = items.stream()
                            .map(OrderItem::getSubtotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    return VendorOrderDto.builder()
                            .orderId(order.getId())
                            .status(order.getStatus().name())
                            .createdAt(order.getCreatedAt())
                            .shippingAddress(order.getShippingAddress())
                            .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                            .customerEmail(order.getUser().getEmail())
                            .vendorTotal(vendorTotal)
                            .items(items.stream()
                                    .map(item -> VendorOrderDto.VendorOrderItemDto.builder()
                                            .id(item.getId())
                                            .productName(item.getProduct().getName())
                                            .quantity(item.getQuantity())
                                            .price(item.getPrice())
                                            .build())
                                    .collect(Collectors.toList()))
                            .build();
                })
                .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorDto> getMyVendors() {
        AppUser currentUser = userService.getCurrentUser();
        List<Vendor> vendors = vendorRepository.findByUserId(currentUser.getId());
        log.info("Found {} vendors for user: {}", vendors.size(), currentUser.getEmail());
        return vendors.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VendorDto getVendorById(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorId));
        
        // Check ownership (admin can access any vendor)
        if (!vendor.getUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BusinessException("You don't have permission to access this vendor");
        }
        
        return convertToDto(vendor);
    }

    @Override
    @Transactional
    public VendorDto createVendor(CreateVendorRequest request) {
        AppUser currentUser = userService.getCurrentUser();
        
        // Check if store name already exists
        if (vendorRepository.existsByStoreName(request.storeName())) {
            throw new BusinessException("Store name already exists: " + request.storeName());
        }
        
        Vendor vendor = Vendor.builder()
                .storeName(request.storeName())
                .storeDescription(request.storeDescription())
                .address(request.address())
                .contactEmail(request.contactEmail())
                .contactPhone(request.contactPhone())
                .user(currentUser)
                .build();
        
        Vendor savedVendor = vendorRepository.save(vendor);
        
        // Add VENDOR role if user doesn't have it
        if (!currentUser.hasRole(Role.VENDOR)) {
            currentUser.addRole(Role.VENDOR);
            userService.updateUserRoles(currentUser);
        }
        
        log.info("Created new vendor '{}' for user: {}", request.storeName(), currentUser.getEmail());
        return convertToDto(savedVendor);
    }

    @Override
    @Transactional
    public VendorDto updateVendor(Long vendorId, UpdateVendorRequest request) {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorId));
        
        // Check ownership (admin can update any vendor)
        if (!vendor.getUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BusinessException("You don't have permission to update this vendor");
        }

        // Check if store name is being changed and if it's unique
        if (request.storeName() != null && !request.storeName().isBlank() 
                && !request.storeName().equals(vendor.getStoreName())) {
            if (vendorRepository.existsByStoreName(request.storeName())) {
                throw new BusinessException("Store name already exists: " + request.storeName());
            }
            vendor.setStoreName(request.storeName());
        }

        if (request.storeDescription() != null) {
            vendor.setStoreDescription(request.storeDescription());
        }
        if (request.address() != null) {
            vendor.setAddress(request.address());
        }
        if (request.contactEmail() != null) {
            vendor.setContactEmail(request.contactEmail());
        }
        if (request.contactPhone() != null) {
            vendor.setContactPhone(request.contactPhone());
        }

        Vendor savedVendor = vendorRepository.save(vendor);
        log.info("Updated vendor '{}' for user: {}", vendor.getStoreName(), currentUser.getEmail());
        return convertToDto(savedVendor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorDto getCurrentVendor() {
        List<VendorDto> vendors = getMyVendors();
        if (vendors.isEmpty()) {
            throw new ResourceNotFoundException("No vendor profile found for current user");
        }
        // Return first vendor for backward compatibility
        return vendors.get(0);
    }

    @Override
    @Transactional
    public VendorDto updateCurrentVendor(UpdateVendorRequest request) {
        VendorDto currentVendor = getCurrentVendor();
        return updateVendor(currentVendor.id(), request);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vendor> getVendorEntityByUserId(Long userId) {
        List<Vendor> vendors = vendorRepository.findByUserId(userId);
        return vendors.isEmpty() ? Optional.empty() : Optional.of(vendors.get(0));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getVendorProducts(String storeName) {
        Vendor vendor = vendorRepository.findByStoreNameIgnoreCase(storeName)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with store name: " + storeName));
        
        return productRepository.findByVendorIdAndActiveTrue(vendor.getId())
                .stream()
                .map(productService::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public VendorDto convertToDto(Vendor vendor) {
        return VendorDto.builder()
                .id(vendor.getId())
                .storeName(vendor.getStoreName())
                .storeDescription(vendor.getStoreDescription())
                .address(vendor.getAddress())
                .contactEmail(vendor.getContactEmail())
                .contactPhone(vendor.getContactPhone())
                .userId(vendor.getUser().getId())
                .userEmail(vendor.getUser().getEmail())
                .userFullName(vendor.getUser().getFirstName() + " " + vendor.getUser().getLastName())
                .build();
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long vendorId, Long orderId, OrderStatus status) {
        AppUser currentUser = userService.getCurrentUser();
        
        // Verify vendor ownership
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + vendorId));
        
        if (!vendor.getUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BusinessException("You don't have permission to update orders for this vendor");
        }
        
        // Find the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        
        // Verify the order contains items from this vendor
        boolean hasVendorItems = order.getOrderItems().stream()
                .anyMatch(item -> item.getVendor() != null && item.getVendor().getId().equals(vendorId));
        
        if (!hasVendorItems) {
            throw new BusinessException("This order does not contain items from your store");
        }
        
        // Update order status
        order.setStatus(status);
        orderRepository.save(order);
        
        log.info("Updated order {} status to {} by vendor {}", orderId, status, vendorId);
    }

    @Override
    @Transactional
    public void deleteVendor(Long vendorId) {
        AppUser currentUser = userService.getCurrentUser();
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorId));
        
        // Check ownership (admin can delete any vendor)
        if (!vendor.getUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BusinessException("You don't have permission to delete this vendor");
        }
        
        // Check if vendor has any products
        long productCount = productRepository.findByVendorIdAndActiveTrue(vendorId).size();
        if (productCount > 0) {
            throw new BusinessException("Cannot delete vendor with active products. Please delete or deactivate all products first.");
        }
        
        vendorRepository.delete(vendor);
        log.info("Deleted vendor '{}' by user: {}", vendor.getStoreName(), currentUser.getEmail());
    }
}
