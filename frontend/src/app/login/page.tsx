// app/login/page.tsx
'use client' // Đánh dấu đây là Client Component vì chúng ta cần sử dụng state và event handlers

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

// Định nghĩa kiểu dữ liệu cho các lỗi validation
interface FormErrors {
	email?: string
	password?: string
}

export default function LoginPage() {
	const router = useRouter()

	// State để lưu trữ dữ liệu form
	const [email, setEmail] = useState('danhtien2k54@gmail.com')
	const [password, setPassword] = useState('123456')

	// State để quản lý trạng thái loading khi gọi API
	const [isLoading, setIsLoading] = useState(false)

	// State để lưu các lỗi validation từ phía client
	const [errors, setErrors] = useState<FormErrors>({})

	// State để lưu lỗi từ API response
	const [apiError, setApiError] = useState<string | null>(null)

	// Hàm validate dữ liệu form
	const validateForm = (): FormErrors => {
		const newErrors: FormErrors = {}

		if (!email) {
			newErrors.email = 'Email là bắt buộc.'
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Địa chỉ email không hợp lệ.'
		}

		if (!password) {
			newErrors.password = 'Mật khẩu là bắt buộc.'
		} else if (password.length < 6) {
			newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
		}

		return newErrors
	}

	// Hàm xử lý khi submit form
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Ngăn trình duyệt reload lại trang

		// Reset lỗi cũ
		setApiError(null)
		const formErrors = validateForm()

		// Nếu có lỗi validation, cập nhật state và dừng lại
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors)
			return
		}

		// Nếu không có lỗi, reset state lỗi và bắt đầu quá trình gọi API
		setErrors({})
		setIsLoading(true)

		try {
			// Gọi API đăng nhập
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				},
			)

			const data = await response.json()

			if (!response.ok) {
				// Nếu response trả về lỗi (status code 4xx, 5xx)
				throw new Error(
					data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
				)
			}

			// Đăng nhập thành công
			console.log('Đăng nhập thành công:', data)

			// Lưu token vào localStorage (ví dụ)
			// localStorage.setItem('token', data.token);

			// Chuyển hướng người dùng đến trang dashboard hoặc trang chủ
			router.push('/')
		} catch (error: any) {
			// Xử lý lỗi từ API (network error hoặc lỗi từ logic ở trên)
			setApiError(error.message)
		} finally {
			// Dù thành công hay thất bại, luôn dừng trạng thái loading
			setIsLoading(false)
		}
	}

	return (
		<>
			<div className="container">
				<form onSubmit={handleSubmit} className="form">
					<h1>Đăng nhập</h1>

					{/* Hiển thị lỗi từ API */}
					{apiError && <p className="error-api">{apiError}</p>}

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={errors.email ? 'input-error' : ''}
							disabled={isLoading}
						/>
						{errors.email && (
							<p className="error-validation">{errors.email}</p>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">Mật khẩu</label>
						<input
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={errors.password ? 'input-error' : ''}
							disabled={isLoading}
						/>
						{errors.password && (
							<p className="error-validation">
								{errors.password}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="submit-button"
					>
						{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
					</button>
				</form>
			</div>

			{/* CSS-in-JS sử dụng JSX Style. Toàn bộ CSS nằm trong component */}
			<style jsx>{`
				.container {
					display: flex;
					justify-content: center;
					align-items: center;
					min-height: 100vh;
					background-color: #f0f2f5;
				}
				.form {
					background: white;
					padding: 2rem;
					border-radius: 8px;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
					width: 100%;
					max-width: 400px;
				}
				h1 {
					text-align: center;
					margin-bottom: 1.5rem;
					color: #333;
				}
				.form-group {
					margin-bottom: 1rem;
				}
				label {
					display: block;
					margin-bottom: 0.5rem;
					font-weight: 600;
					color: #555;
				}
				input {
					width: 100%;
					padding: 0.75rem;
					border: 1px solid #ccc;
					border-radius: 4px;
					font-size: 1rem;
					transition: border-color 0.2s;
					color: #000;
				}
				input:focus {
					outline: none;
					border-color: #0070f3;
				}
				.input-error {
					border-color: #e53e3e;
				}
				.error-validation {
					color: #e53e3e;
					font-size: 0.875rem;
					margin-top: 0.25rem;
				}
				.error-api {
					color: #e53e3e;
					background-color: #fed7d7;
					border: 1px solid #fbb6b6;
					border-radius: 4px;
					padding: 0.75rem;
					margin-bottom: 1rem;
					text-align: center;
				}
				.submit-button {
					width: 100%;
					padding: 0.75rem;
					border: none;
					border-radius: 4px;
					background-color: #0070f3;
					color: white;
					font-size: 1rem;
					font-weight: 700;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				.submit-button:hover:not(:disabled) {
					background-color: #005bb5;
				}
				.submit-button:disabled {
					background-color: #a0aec0;
					cursor: not-allowed;
				}
			`}</style>
		</>
	)
}
