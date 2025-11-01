class MaternityCase(Base):
    __tablename__ = "maternity_cases"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
