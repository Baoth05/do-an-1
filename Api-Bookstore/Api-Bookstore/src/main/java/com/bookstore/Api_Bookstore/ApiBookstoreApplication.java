	package com.bookstore.Api_Bookstore;

	import com.bookstore.Api_Bookstore.models.Book;
	import com.bookstore.Api_Bookstore.models.Role;
	import com.bookstore.Api_Bookstore.repositories.BookRepository;
	import com.bookstore.Api_Bookstore.repositories.RoleRepository;
	import org.springframework.boot.CommandLineRunner;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.context.annotation.Bean;

	import java.util.Arrays;

	@SpringBootApplication
	public class ApiBookstoreApplication {

		public static void main(String[] args) {
			SpringApplication.run(ApiBookstoreApplication.class, args);
		}

		/*
		@Bean
		CommandLineRunner initDatabase(BookRepository bookRepository) {
			return args -> {
				Book book1 = new Book(null, "Nhà Giả Kim", "Paulo Coelho", 79000, 208, "Một cuốn tiểu thuyết đầy cảm hứng về việc theo đuổi ước mơ.", "https://salt.tikicdn.com/cache/w1200/ts/product/d6/53/33/d33c82ea97a31b264936f44d1ceaf364.jpg", 1988);
				Book book2 = new Book(null, "Đắc Nhân Tâm", "Dale Carnegie", 99000, 320, "Nghệ thuật đối nhân xử thế và thu phục lòng người.", "https://salt.tikicdn.com/cache/w1200/ts/product/ac/40/3e/362a7045b595b8f683f2a83e7428f28d.jpg", 1936);
				Book book3 = new Book(null, "Muôn Kiếp Nhân Sinh", "Nguyên Phong", 120000, 440, "Những câu chuyện kỳ lạ về luật nhân quả và luân hồi.", "https://salt.tikicdn.com/cache/w1200/ts/product/f4/b7/a1/9b953c8473269326938977536413d421274f.jpg", 2020);

				bookRepository.saveAll(Arrays.asList(book1, book2, book3));
				System.out.println("Đã chèn 3 cuốn sách mẫu vào database.");
			};
		}
		*/
		@Bean
		CommandLineRunner initDatabase(RoleRepository roleRepository) {
			return args -> {
				if (roleRepository.findByName("ROLE_USER").isEmpty()) {
					roleRepository.save(new Role("ROLE_USER"));
					System.out.println("đã chèn ROLE_USER vào database.");
				}
				if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
					roleRepository.save(new Role("ROLE_ADMIN"));
					System.out.println("đẫ chèn ROLE_ADMIN vào database.");
				}

			};
		}
	}




