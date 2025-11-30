package com.bookstore.Api_Bookstore.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileUploadController   {
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileUploadController(){
        try{
            Files.createDirectories(this.fileStorageLocation);

        }
        catch (Exception e){
            throw new RuntimeException("Không thể tạo  thư mục uploads", e);

        }
    }
    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file")MultipartFile file){
        try {
            // 1. Tạo tên file duy nhất (để tránh trùng tên)
            String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());

            // 2. Lưu file vào thư mục uploads
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 3. Trả về đường dẫn URL đầy đủ để Frontend dùng
            // Lưu ý: Port 8080 là port của Backend bạn
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);
        }
        catch (IOException ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi upload: " + ex.getMessage());
        }
    }
}
