ALTER TABLE `playlist` 
ADD COLUMN `image` VARCHAR(100) NULL DEFAULT NULL AFTER `created_at`;
