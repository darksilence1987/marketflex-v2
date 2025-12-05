# --- Stage 1: Build ---
# Direkt JDK imajı kullanıyoruz. Gradle'ı imajdan değil,
# projenin kendi 'gradlew' wrapper'ından çağıracağız.
# Not: Java 25 EA (Early Access) olduğu için tag değişebilir,
# 'amazoncorretto:25' yoksa 'amazoncorretto:25-al2023-jdk' gibi spesifik bir tag gerekebilir.
# Şimdilik en güncel yapıyı baz alıyoruz.
FROM amazoncorretto:25-al2023-jdk AS builder

# Java 25 önizleme özelliklerini derleme zamanında açmak için
# (Eğer Corretto 25 henüz yoksa ve 23 kullanıyorsan burası patlayabilir,
# Java 25 imajının kesin adını Docker Hub'dan teyit etmen gerekebilir.
# Şimdilik senin 'Java 25' hedefine sadık kalarak yazıyorum)
# FROM amazoncorretto:25-al2023-jdk AS builder <-- Hedefimiz bu

# KRİTİK DÜZELTME:
# Gradle Wrapper'ın çalışması için gerekli olan 'xargs' (findutils içinde) paketini yüklüyoruz.
# Amazon Linux 2025 minimal olduğu için bu varsayılan olarak gelmiyor.
RUN dnf install -y findutils

WORKDIR /app

# Gradle Wrapper dosyalarını kopyala
COPY gradle gradle
COPY gradlew .
COPY build.gradle settings.gradle ./

# Wrapper'a çalıştırma izni ver (Linux/Mac ortamında build alırken hata vermemesi için)
RUN chmod +x gradlew

# Bağımlılıkları önceden indirmek için (Opsiyonel ama cache için iyi)
# RUN ./gradlew dependencies --no-daemon

# Kaynak kodları kopyala
COPY src src

# Build al
# Gradle 9.2.1'i wrapper otomatik indirecek.
# --no-daemon: CI/CD dostu mod.
RUN ./gradlew build --no-daemon -x test

# --- Stage 2: Runtime ---
# Runtime için daha hafif olan 'headless' sürümü tercih edilir
FROM amazoncorretto:25-al2023-headless
# FROM amazoncorretto:25-al2023-headless <-- Hedefimiz bu

WORKDIR /app

# Builder aşamasından çıkan JAR'ı al
COPY --from=builder /app/build/libs/*.jar app.jar

# Ortam değişkenleri
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

# Java 25 Preview özellikleriyle başlat
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]